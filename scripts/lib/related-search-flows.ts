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
    RelatedSearchFlow,
    RelatedSearchFlows,
} from "@/src/utils/other-services-suggestions"

type Answer = string | Array<string>
type Answers = Record<string, Answer>

// Categories whose search query comes from the url rather than from
// personalisation answers so can't be reached by saving answers
const SKIPPED_CATEGORIES = ["search", "disability-advocacy-finder"]

// Only the first 2 answers to a multiple choice question (in the order they
// were selected) affect the search query, so every ordered selection of up to
// 2 answers covers every distinct query.
function getPossibleAnswers(page: PersonalisationQuestionPage): Array<Answer> {
    const answers = Object.keys(page.possibleAnswers)
    if (page.multipleChoice) {
        return [
            [],
            ...answers.map(answer => [answer]),
            ...answers.flatMap(first => answers
                .filter(second => second !== first)
                .map(second => [first, second])
            ),
        ]
    }
    return [...answers, "(skipped)"]
}

function saveAnswer(page: PersonalisationPage, answer: Answer | null) {
    if (answer === null) {
        storage.removeItem(page.name)
    } else if (Array.isArray(answer)) {
        // Copied since setJSON() may sort the array in place
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
    return convertIzzySearchQueryToIss3(query).q ?? ""
}

// If giving a different answer to the page would show or hide a later question
// which can change the search query (eg answering "No" to sleep-tonight hides
// the housing subcategory question) then returns every answer which shows the
// same questions as the given answer. Otherwise returns null. Expects the
// current answers to be in storage.
function getAnswersShowingSameQuestions(
    category: Category,
    page: PersonalisationPage,
    answer: Answer,
): Array<Answer> | null {
    if (page.type !== "question") {
        return null
    }
    const laterPages = category.personalisation
        .slice(category.personalisation.indexOf(page) + 1)
        .filter(laterPage => laterPage.type === "question" &&
            laterPage.getShouldIncludePage &&
            Object.values(laterPage.possibleAnswers)
                .some(changes => Object.keys(changes).length)
        )
    if (!laterPages.length) {
        return null
    }
    const getLaterPagesIncluded = () => laterPages
        .map(laterPage => laterPage.getShouldIncludePage?.(category))
        .join()
    const currentLaterPagesIncluded = getLaterPagesIncluded()
    const possibleAnswers = getPossibleAnswers(page)
    const answersShowingSameQuestions = possibleAnswers.filter(otherAnswer => {
        saveAnswer(page, otherAnswer)
        return getLaterPagesIncluded() === currentLaterPagesIncluded
    })
    saveAnswer(page, answer)
    return answersShowingSameQuestions.length < possibleAnswers.length ?
        answersShowingSameQuestions
        : null
}

// Returns the answers with any which don't affect the ISS3 "q" value removed,
// including individual selections of multiple choice answers. Answers are
// removed one at a time so that answers which only have no effect because of
// another answer (eg both replace the search term with the same value) aren't
// both removed. Answers which show or hide a later question that can change
// the search query are kept since they affect "q" indirectly.
function getAnswersAffectingQ(
    category: Category,
    answers: Answers,
    modifiers: Array<SearchQueryModifier>,
    shownPages: Array<PersonalisationPage>,
): Answers {
    const q = getQ(modifiers)
    let remainingModifiers = modifiers
    const remainingAnswers: Answers = {...answers}

    const getModifiersWithAnswer = (pageName: string, answer: Answer | null) => {
        const page = shownPages.find(page => page.name === pageName)
        const newModifiers = remainingModifiers
            .filter(modifier => modifier.name !== pageName)
        if (answer !== null && page?.type === "question") {
            const newAnswers = Array.isArray(answer) ? answer : [answer]
            newModifiers.push({
                name: pageName,
                changes: newAnswers.map(answer => page.possibleAnswers[answer]),
            })
        }
        return newModifiers
    }

    const setPageAnswer = (pageName: string, answer: Answer | null) => {
        const newModifiers = getModifiersWithAnswer(pageName, answer)
        if (getQ(newModifiers) !== q) {
            return false
        }
        remainingModifiers = newModifiers
        if (answer === null) {
            delete remainingAnswers[pageName]
        } else {
            remainingAnswers[pageName] = answer
        }
        return true
    }

    for (const [pageName, answer] of Object.entries(answers)) {
        const page = shownPages.find(page => page.name === pageName)
        const showsOtherQuestions = page &&
            getAnswersShowingSameQuestions(category, page, answer)
        if (!showsOtherQuestions && setPageAnswer(pageName, null)) {
            continue
        }
        if (!Array.isArray(answer)) {
            continue
        }
        for (const selection of answer) {
            setPageAnswer(
                pageName,
                (remainingAnswers[pageName] as Array<string>)
                    .filter(otherSelection => otherSelection !== selection)
            )
        }
    }
    return remainingAnswers
}

function countAnswers(flow: RelatedSearchFlow): number {
    return Object.values(flow.answers)
        .reduce((count, answer) => count +
            (Array.isArray(answer) ? answer.length : 1), 0)
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
            const router = {
                query: {categoryOrContentPageSlug: category.key},
                route: "",
            } as any as NextRouter

            walkPages(
                category,
                category.personalisation,
                {},
                [],
                (answers, shownPages) => {
                    const modifiers = getSearchQueryModifiers(
                        category,
                        router,
                        shownPages,
                    )
                    const q = normaliseIss3Q(getQ(modifiers))
                    if (!q) {
                        return
                    }
                    const flow = {
                        category: category.key,
                        answers: getAnswersAffectingQ(
                            category,
                            answers,
                            modifiers,
                            shownPages,
                        ),
                    }
                    // Several flows can produce the same "q" so keep the
                    // simplest. Ties keep the first found which is stable
                    // since categories and answers are walked in order.
                    if (!flows[q] || countAnswers(flow) < countAnswers(flows[q])) {
                        flows[q] = flow
                    }
                },
            )
        }
    } finally {
        console.log = originalConsoleLog
    }

    return Object.fromEntries(
        Object.keys(flows).sort().map(q => [q, flows[q]])
    )
}
