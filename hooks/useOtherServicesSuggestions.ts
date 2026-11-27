import {useEffect, useState} from "react"

import type {SearchQuery} from "@/src/iss/searchQueryBuilder"
import {convertIzzySearchQueryToIss3} from "@/src/iss/serviceSearch"
import type {
    OtherServicesSuggestion,
    RelatedSearchesRequest,
    RelatedSearchesResponse,
} from "@/types/other-services-suggestion"

type OtherServicesSuggestionsState = {
    suggestions: Array<OtherServicesSuggestion>,
    // True while waiting for suggestions which may still arrive
    isLoading: boolean,
}

async function fetchSuggestions(
    request: RelatedSearchesRequest,
): Promise<Array<OtherServicesSuggestion>> {
    const response = await fetch("/api/search/related", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
    })
    if (!response.ok) {
        throw new Error(`Responded ${response.status}`)
    }
    const body: RelatedSearchesResponse = await response.json()
    return Array.isArray(body?.suggestions) ? body.suggestions : []
}

/*
 * Suggestions for the "People also searched for" panel based on the ISS3 "q"
 * value of the current search, from POST /api/search/related. Empty while
 * loading, or if there aren't any.
 * See docs/other-services-panel.md § "Where suggestions come from"
 */
export default function useOtherServicesSuggestions(
    izzyQuery: SearchQuery | null | undefined,
): OtherServicesSuggestionsState {
    const [state, setState] = useState<OtherServicesSuggestionsState>(
        {suggestions: [], isLoading: false}
    )
    const q = izzyQuery ? convertIzzySearchQueryToIss3(izzyQuery).q ?? "" : ""

    useEffect(() => {
        if (!q.trim()) {
            setState({suggestions: [], isLoading: false})
            return
        }
        setState({suggestions: [], isLoading: true})
        let cancelled = false
        fetchSuggestions({q})
            .then(suggestions => {
                if (!cancelled) {
                    setState({suggestions, isLoading: false})
                }
            })
            .catch(error => {
                console.warn("Could not load other services suggestions", error)
                if (!cancelled) {
                    setState({suggestions: [], isLoading: false})
                }
            })
        return () => {
            cancelled = true
        }
    }, [q])

    return state
}
