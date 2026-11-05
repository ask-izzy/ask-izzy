import {getRequestWithToken} from "@/src/ix-web-js-client/lib/requests"

type RelatedSearchesResponse = {
    query: string,
    segment: string | null,
    results: Array<string>,
}

// Tailors the results to searches made through Ask Izzy
const SEGMENT = "ask-izzy"
const LIMIT = 8

/*
 * Get searches people often make before or after the given ISS3 "q" value from
 * ISS4's related searches endpoint. The results are raw ISS3 "q" values too.
 *
 * Never throws: suggestions are optional so if the endpoint isn't configured,
 * is unavailable (eg a 503 while the model loads) or errors then no related
 * searches are returned.
 * See docs/other-services-panel.md § "Where suggestions come from"
 */
export async function fetchRelatedSearches(q: string): Promise<Array<string>> {
    const baseUrl = process.env.NEXT_PUBLIC_ISS4_BASE_URL
    const token = process.env.NEXT_PUBLIC_ISS4_API_TOKEN
    if (!baseUrl || !token || !q.trim()) {
        return []
    }

    const url = new URL("/api/directory/search/related/", baseUrl)
    url.searchParams.set("query", q.trim().slice(0, 200))
    url.searchParams.set("segment", SEGMENT)
    url.searchParams.set("limit", String(LIMIT))

    try {
        const response = await getRequestWithToken<RelatedSearchesResponse>(
            url.toString(),
            `Token ${token}`,
        )
        return Array.isArray(response?.results) ?
            response.results.filter(result => typeof result === "string")
            : []
    } catch (error) {
        console.warn("Could not fetch related searches", error)
        return []
    }
}
