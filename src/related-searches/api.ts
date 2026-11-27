// Server only: handles POST /api/search/related, separate from the Next.js
// route so it can be unit tested without the generated lookup table or ISS4.
// See docs/other-services-panel.md § "Where suggestions come from"

import categories from "@/src/constants/categories"
import type {RelatedSearchFlows} from "@/src/related-searches/flows"
import {getOtherServicesSuggestions} from "@/src/related-searches/suggestions"
import {isAnswer} from "@/src/utils/flow-answers"
import type {
    CurrentAnswers,
    RelatedSearchesRequest,
    RelatedSearchesResponse,
} from "@/types/other-services-suggestion"

export type RelatedSearchesDependencies = {
    fetchRelatedSearches: (q: string) => Promise<Array<string>>,
    getFlows: () => RelatedSearchFlows,
}

type Result = {
    status: number,
    body: RelatedSearchesResponse | {message: string},
}

// Question pages, the only ones whose answers are accepted
const questionPageNames = new Set(
    categories.flatMap(category => category.personalisation)
        .filter(page => page.type === "question")
        .map(page => page.name)
)

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value)

/*
 * Keeps only answers to known question pages that are a string or list of
 * strings. Anything else is ignored rather than rejected, since an odd answer
 * in storage shouldn't stop suggestions.
 */
function parseCurrentAnswers(value: unknown): CurrentAnswers {
    if (!isPlainObject(value)) {
        return {}
    }
    const answers: CurrentAnswers = {}
    for (const [pageName, answer] of Object.entries(value)) {
        if (questionPageNames.has(pageName) && isAnswer(answer)) {
            answers[pageName] = answer
        }
    }
    return answers
}

type ParsedRequest = RelatedSearchesRequest & {currentAnswers: CurrentAnswers}

// The request, or why it's invalid
function parseRequest(body: unknown): ParsedRequest | string {
    if (!isPlainObject(body)) {
        return "Expected a JSON object"
    }
    const {q, currentCategory, currentAnswers} = body
    if (typeof q !== "string" || !q.trim()) {
        return "\"q\" must be a non-empty string"
    }
    if (
        currentCategory !== undefined && (
            typeof currentCategory !== "string" ||
            !categories.some(category => category.key === currentCategory)
        )
    ) {
        return "\"currentCategory\" must be the key of a category"
    }
    return {
        q,
        currentCategory: currentCategory as string | undefined,
        currentAnswers: parseCurrentAnswers(currentAnswers),
    }
}

/*
 * Suggestions are optional, so anything going wrong once the request is known
 * to be valid gives no suggestions rather than an error.
 */
export async function handleRelatedSearchesRequest(
    method: string | undefined,
    body: unknown,
    {fetchRelatedSearches, getFlows}: RelatedSearchesDependencies,
): Promise<Result> {
    if (method !== "POST") {
        return {status: 405, body: {message: "Method not allowed"}}
    }
    const request = parseRequest(body)
    if (typeof request === "string") {
        return {status: 400, body: {message: request}}
    }

    try {
        const relatedSearches = await fetchRelatedSearches(request.q)
        // Don't load the lookup table when there's nothing to label
        if (!relatedSearches.length) {
            return {status: 200, body: {suggestions: []}}
        }
        return {
            status: 200,
            body: {
                suggestions: getOtherServicesSuggestions(
                    relatedSearches,
                    request.q,
                    getFlows(),
                    request.currentCategory,
                    request.currentAnswers,
                ),
            },
        }
    } catch (error) {
        console.error(
            "Could not get related searches:",
            error instanceof Error ? error.message : error,
        )
        return {status: 200, body: {suggestions: []}}
    }
}
