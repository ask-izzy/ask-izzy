// Server only: handles POST /api/search/related, separate from the Next.js
// route so it can be unit tested without the generated lookup table or ISS4.
// See docs/other-services-panel.md § "Where suggestions come from"

import type {RelatedSearchFlows} from "@/src/related-searches/flows"
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

// The request, or why it's invalid
function parseRequest(body: unknown): RelatedSearchesRequest | string {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return "Expected a JSON object"
    }
    const {q} = body as Record<string, unknown>
    if (typeof q !== "string" || !q.trim()) {
        return "\"q\" must be a non-empty string"
    }
    return {q}
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
