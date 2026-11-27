// Server only: ISS4's related searches endpoint.
// See docs/other-services-panel.md § "Ask Izzy's related searches endpoint"

// Tailors the results to searches made through Ask Izzy
const SEGMENT = "ask-izzy"
const LIMIT = 8
// Caps the URL length. Longer than any q the app builds (currently at most 225)
const MAX_QUERY_LENGTH = 1000
// Placeholder chips show until suggestions arrive, so don't keep them waiting
// on a slow ISS4
const TIMEOUT_MS = 3000

/*
 * Searches people often make before or after the given ISS3 "q" value, as raw
 * ISS3 "q" values. Never throws: gives [] if ISS4 isn't configured, fails or
 * times out. Not cached so ISS4's request stats stay accurate.
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
