// Builds the ISS3 "q" to flow (category and answers) lookup table.
// See docs/other-services-panel.md § "Turning a related search back into a flow"
//
// Writes answers to the global storage and silences console.log, so only run
// it in its own process (the generator script or a test), never in the server.

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
import {normaliseIss3Q} from "@/src/related-searches/flows"
import type {
    RelatedSearchFlow,
    RelatedSearchFlows,
} from "@/src/related-searches/flows"
import type {Answer, FlowAnswers} from "@/src/utils/flow-answers"

type Answers = Record<string, Answer>
type Leaf = {answers: Answers, q: string}

// Their search query comes from the url, not from answers
const SKIPPED_CATEGORIES = ["search", "disability-advocacy-finder"]

// Multiple choice answers are sorted when saved and only the first 2 affect
// the search query, so selections of up to 2 cover every query. Skipping (or selecting nothing) comes first so it's
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
        // Clear any answer an earlier path left, since later pages' search
        // query changes can read it
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

// Mirrors getSearchQueryModifiers() in src/iss/searchQueryBuilder.ts but uses
// the pages shown in the walk, since getPersonalisationPages() only applies
// getShouldIncludePage() in a browser.
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

// The answers in the leaf which must be saved to reproduce its "q". Equivalent
// answers to a page are found among leaves with the same answers to every
// other page, so an answer which shows or hides a later question (different
// pages answered) is never grouped with others or left out.
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

// How much following the flow could change the user's answers. A oneOf
// counts for less since the user may already have one of its answers.
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
// page has the same answers. Keyed by "<page>\n<other answers>", then by
// answer.
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

    // Some categories' search query changes log
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
                // Keep the flow which changes the user's answers least. Ties
                // keep the first (the walk order is deterministic).
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
