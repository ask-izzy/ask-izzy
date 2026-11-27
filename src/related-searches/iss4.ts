// Server only: ISS4's related searches endpoint.
// See docs/other-services-panel.md § "Where suggestions come from"

// Tailors the results to searches made through Ask Izzy
const SEGMENT = "ask-izzy"
const LIMIT = 8
const MAX_QUERY_LENGTH = 200
// Placeholder chips show until suggestions arrive, so don't keep them waiting
// on a slow ISS4
const TIMEOUT_MS = 3000

/*
 * Get searches people often make before or after the given ISS3 "q" value from
 * ISS4's related searches endpoint. The results are raw ISS3 "q" values too.
 *
 * Never throws: suggestions are optional so if the endpoint isn't configured,
 * is unavailable (eg a 503 while the model loads), errors or is too slow then
 * no related searches are returned. Responses aren't cached so that ISS4's
 * request stats stay accurate.
 */
export async function fetchRelatedSearches(q: string): Promise<Array<string>> {
    const baseUrl = process.env.ISS4_BASE_URL
    const token = process.env.ISS4_API_TOKEN
    if (!baseUrl || !token || !q.trim()) {
        return []
    }

    const url = new URL("/api/directory/search/related/", baseUrl)
    url.searchParams.set("query", q.trim().slice(0, MAX_QUERY_LENGTH))
    url.searchParams.set("segment", SEGMENT)
    url.searchParams.set("limit", String(LIMIT))

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Token ${token}`,
                Accept: "application/json",
            },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        })
        if (!response.ok) {
            console.warn(
                `Could not fetch related searches: ISS4 responded ${response.status}`
            )
            return []
        }
        const body = await response.json()
        return Array.isArray(body?.results) ?
            body.results.filter(result => typeof result === "string")
            : []
    } catch (error) {
        console.warn(
            "Could not fetch related searches:",
            error instanceof Error ? error.message : error,
        )
        return []
    }
}
