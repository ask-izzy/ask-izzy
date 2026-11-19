// Builds the lookup table from every ISS3 "q" value the app can send to the
// category and personalisation answers (the "flow") which produces it. The
// related searches endpoint returns raw ISS3 "q" values so this is how they
// are turned back into somewhere to send the user.
// See docs/other-services-panel.md § "Turning a related search back into a flow"
//
// The real query building code is used (search query changes from each
// category/page, merged by buildSearchQueryFromModifiers and converted by
// convertIzzySearchQueryToIss3) so the table reflects actual app behaviour.
// Answers are written to the in-memory storage which is used when running
// outside of a browser.
//
// Adapted from the "create query map" script which also produced maps of the
// full ISS3 request for every flow.

import type {NextRouter} from "next/router"

import type {
    PersonalisationPage,
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"
import type Category from "@/src/constants/Category"
import categories from "@/src/constants/categories"
import storage from "@/src/storage"
import {buildSearchQueryFromModifiers} from "@/src/iss/searchQueryBuilder"
import type {
    SearchQueryChanges,
    SearchQueryModifier,
} from "@/src/iss/searchQueryBuilder"
import {getSearchQueryChanges} from "@/src/utils/personalisation"
import {convertIzzySearchQueryToIss3} from "@/src/iss/serviceSearch"
import {normaliseIss3Q} from "@/src/utils/other-services-suggestions"
import type {
    FlowAnswers,
    RelatedSearchFlow,
    RelatedSearchFlows,
} from "@/src/utils/other-services-suggestions"

type Answer = string | Array<string>
type Answers = Record<string, Answer>
type Leaf = {answers: Answers, q: string}

// Categories whose search query comes from the url rather than from
// personalisation answers so can't be reached by saving answers
const SKIPPED_CATEGORIES = ["search", "disability-advocacy-finder"]

// Multiple choice answers are sorted when saved and only the first 2 affect
// the search query, so every sorted selection of up to 2 answers covers every
// distinct query. Skipping (or selecting nothing) comes first so it's
// preferred when it's one of several answers with the same effect.
function getPossibleAnswers(page: PersonalisationQuestionPage): Array<Answer> {
    const answers = Object.keys(page.possibleAnswers)
    if (page.multipleChoice) {
        return [
            [],
            ...answers.map(answer => [answer]),
            ...answers.flatMap((first, index) => answers
                .slice(index + 1)
                .map(second => [first, second].sort())
            ),
        ]
    }
    return ["(skipped)", ...answers]
}

function saveAnswer(page: PersonalisationPage, answer: Answer | null) {
    if (answer === null) {
        storage.removeItem(page.name)
    } else if (Array.isArray(answer)) {
        // Copied since setJSON() sorts the array in place
        storage.setJSON(page.name, [...answer])
    } else {
        storage.setItem(page.name, answer, false)
    }
}

// Walks every path through the category's personalisation pages, calling
// onLeaf with the answers given and the pages shown for each one.
function walkPages(
    category: Category,
    pages: Array<PersonalisationPage>,
    answers: Answers,
    shownPages: Array<PersonalisationPage>,
    onLeaf: (answers: Answers, shownPages: Array<PersonalisationPage>) => void,
) {
    if (!pages.length) {
        onLeaf(answers, shownPages)
        return
    }
    const [page, ...remainingPages] = pages

    if (page.getShouldIncludePage && !page.getShouldIncludePage(category)) {
        saveAnswer(page, null)
        walkPages(category, remainingPages, answers, shownPages, onLeaf)
        return
    }

    if (page.type !== "question") {
        walkPages(
            category,
            remainingPages,
            answers,
            [...shownPages, page],
            onLeaf,
        )
        return
    }

    for (const answer of getPossibleAnswers(page)) {
        saveAnswer(page, answer)
        walkPages(
            category,
            remainingPages,
            {...answers, [page.name]: answer},
            [...shownPages, page],
            onLeaf,
        )
    }
    saveAnswer(page, null)
}

// Mirrors getSearchQueryModifiers() in src/iss/searchQueryBuilder.ts but
// uses the pages shown during the walk since getPersonalisationPages() doesn't
// filter pages with getShouldIncludePage() when not running in a browser.
function getSearchQueryModifiers(
    category: Category,
    router: NextRouter,
    shownPages: Array<PersonalisationPage>,
): Array<SearchQueryModifier> {
    const categoryChanges = typeof category.searchQueryChanges === "function" ?
        category.searchQueryChanges(router)
        : category.searchQueryChanges
    const modifiers: Array<SearchQueryModifier> = [
        {name: `category - ${category.key}`, changes: {...categoryChanges}},
    ]
    for (const page of shownPages) {
        const changes = getSearchQueryChanges(page)
        if (!changes) {
            throw new Error(
                `No search query changes for "${page.name}" in ` +
                `"${category.key}" category`
            )
        }
        modifiers.push({
            name: page.name,
            changes: changes as SearchQueryChanges | Array<SearchQueryChanges>,
        })
    }
    return modifiers
}

function getQ(modifiers: Array<SearchQueryModifier>): string {
    // eslint-disable-next-line no-unused-vars
    const {maxPageSize, ...query} = buildSearchQueryFromModifiers(modifiers)
    return normaliseIss3Q(convertIzzySearchQueryToIss3(query).q ?? "")
}

// Identifies the leaves which have the same answers apart from the given page
function getKeyWithout(answers: Answers, pageName: string): string {
    return JSON.stringify(
        Object.entries(answers).filter(([name]) => name !== pageName)
    )
}

// Returns the answers in the leaf which have to be saved to reproduce its "q"
// value.
//
// Following a flow only saves the answers in it, so the user's existing
// answers (or none) are used for every other page. An answer can therefore
// only be left out if every possible answer to that page, including skipping
// it, gives the same "q" value. Otherwise it's kept, even if it's "(skipped)"
// (eg skipping the food subcategory is what keeps the default food search
// terms, which picking any subcategory would replace).
//
// When several answers to a page give the same "q" value (eg most ages add no
// search terms) they're all listed with "oneOf" so a user who already gave
// one of them keeps it. The first is saved for anyone else, which is skipping
// (or selecting nothing) when that's one of them.
//
// Other answers to the page come from the other leaves with the same answers
// to every other page. An answer which shows or hides a later question gives
// leaves with different pages answered, so it's never treated as the same as
// one which doesn't and the page is never left out.
// See docs/other-services-panel.md § "Turning a related search back into a flow"
function getFlowAnswers(
    leaf: Leaf,
    possibleAnswersByPage: Map<string, Array<Answer>>,
    qsByKeyWithout: Map<string, Map<string, string>>,
): FlowAnswers {
    const flowAnswers: FlowAnswers = {}
    for (const [pageName, answer] of Object.entries(leaf.answers)) {
        const possibleAnswers = possibleAnswersByPage.get(pageName) || []
        const qsByAnswer = qsByKeyWithout
            .get(`${pageName}\n${getKeyWithout(leaf.answers, pageName)}`)
        const equivalentAnswers = possibleAnswers.filter(otherAnswer =>
            qsByAnswer?.get(JSON.stringify(otherAnswer)) === leaf.q
        )
        if (equivalentAnswers.length === possibleAnswers.length) {
            continue
        }
        flowAnswers[pageName] = equivalentAnswers.length > 1 ?
            {oneOf: equivalentAnswers}
            : answer
    }
    return flowAnswers
}

// How much following the flow could change the user's answers
function countAnswers(flow: RelatedSearchFlow): number {
    let count = 0
    for (const answer of Object.values(flow.answers)) {
        if (Array.isArray(answer)) {
            count += answer.length
        } else if (typeof answer === "object") {
            count += 1 / answer.oneOf.length
        } else {
            count += 1
        }
    }
    return count
}

function getLeaves(category: Category): Array<Leaf> {
    const router = {
        query: {categoryOrContentPageSlug: category.key},
        route: "",
    } as any as NextRouter
    const leaves: Array<Leaf> = []
    walkPages(
        category,
        category.personalisation,
        {},
        [],
        (answers, shownPages) => leaves.push({
            answers,
            q: getQ(getSearchQueryModifiers(category, router, shownPages)),
        }),
    )
    return leaves
}

function getPossibleAnswersByPage(
    category: Category,
): Map<string, Array<Answer>> {
    const possibleAnswersByPage = new Map<string, Array<Answer>>()
    for (const page of category.personalisation) {
        if (page.type === "question") {
            possibleAnswersByPage.set(page.name, getPossibleAnswers(page))
        }
    }
    return possibleAnswersByPage
}

// For each page, the "q" value given by each answer to it when every other
// page has the same answers
function getQsByKeyWithout(
    leaves: Array<Leaf>,
): Map<string, Map<string, string>> {
    const qsByKeyWithout = new Map<string, Map<string, string>>()
    for (const leaf of leaves) {
        for (const [pageName, answer] of Object.entries(leaf.answers)) {
            const key = `${pageName}\n${getKeyWithout(leaf.answers, pageName)}`
            if (!qsByKeyWithout.has(key)) {
                qsByKeyWithout.set(key, new Map())
            }
            qsByKeyWithout.get(key)?.set(JSON.stringify(answer), leaf.q)
        }
    }
    return qsByKeyWithout
}

export function buildRelatedSearchFlows(): RelatedSearchFlows {
    const flows: RelatedSearchFlows = {}

    // Some categories log their search query changes which we don't want to
    // clutter the output
    const originalConsoleLog = console.log
    console.log = () => {}

    try {
        for (const category of categories) {
            if (SKIPPED_CATEGORIES.includes(category.key)) {
                continue
            }
            const leaves = getLeaves(category)
            const possibleAnswersByPage = getPossibleAnswersByPage(category)
            const qsByKeyWithout = getQsByKeyWithout(leaves)

            for (const leaf of leaves) {
                if (!leaf.q) {
                    continue
                }
                const flow = {
                    category: category.key,
                    answers: getFlowAnswers(
                        leaf,
                        possibleAnswersByPage,
                        qsByKeyWithout,
                    ),
                }
                // Several flows can produce the same "q" so keep the one
                // which changes the user's answers least. Ties keep the first
                // found which is stable since categories and answers are
                // walked in order.
                if (!flows[leaf.q] ||
                    countAnswers(flow) < countAnswers(flows[leaf.q])
                ) {
                    flows[leaf.q] = flow
                }
            }
        }
    } finally {
        console.log = originalConsoleLog
    }

    return Object.fromEntries(
        Object.keys(flows).sort().map(q => [q, flows[q]])
    )
}
