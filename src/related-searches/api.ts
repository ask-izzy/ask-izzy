// Server only: handles POST /api/search/related, separate from the Next.js
// route so it can be unit tested without the generated lookup table or ISS4.
// See docs/other-services-panel.md § "Where suggestions come from"

import categories from "@/src/constants/categories"
import type {RelatedSearchFlows} from "@/src/related-searches/flows"
import type {CurrentAnswers} from "@/src/related-searches/labels"
import {getOtherServicesSuggestions} from "@/src/related-searches/suggestions"
import type {
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

// Names of every personalisation page with answers worth sending
const questionPageNames = new Set(
    categories.flatMap(category => category.personalisation)
        .filter(page => page.type === "question")
        .map(page => page.name)
)

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value)

/*
 * Keeps only answers to known question pages which are a string, or a list
 * of strings for multiple choice pages. Anything else is ignored rather than
 * rejected, since an odd answer in storage shouldn't stop suggestions.
 */
function parseCurrentAnswers(value: unknown): CurrentAnswers {
    if (!isPlainObject(value)) {
        return {}
    }
    return Object.fromEntries(
        Object.entries(value).filter(([pageName, answer]) =>
            questionPageNames.has(pageName) && (
                typeof answer === "string" ||
                (Array.isArray(answer) &&
                    answer.every(selection => typeof selection === "string"))
            )
        )
    ) as CurrentAnswers
}

type ParsedRequest = Omit<RelatedSearchesRequest, "currentAnswers"> & {
    currentAnswers: CurrentAnswers,
}

// Returns the request if it's valid, otherwise why it isn't
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
