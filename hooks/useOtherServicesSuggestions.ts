import {useEffect, useState} from "react"

import type {SearchQuery} from "@/src/iss/searchQueryBuilder"
import {convertIzzySearchQueryToIss3} from "@/src/iss/serviceSearch"
import {
    fetchRelatedSearches,
    isRelatedSearchesConfigured,
} from "@/src/iss/relatedSearches"
import {
    getOtherServicesSuggestions,
    loadRelatedSearchFlows,
} from "@/src/utils/other-services-suggestions"
import type {OtherServicesSuggestion} from "@/src/utils/other-services-suggestions"

type OtherServicesSuggestionsState = {
    suggestions: Array<OtherServicesSuggestion>,
    // True while waiting for suggestions which may still arrive
    isLoading: boolean,
}

/*
 * Suggestions for the "People also searched for" panel based on the ISS3 "q"
 * value of the current search. Empty while loading, or if there aren't any.
 * See docs/other-services-panel.md § "Where suggestions come from"
 */
export default function useOtherServicesSuggestions(
    izzyQuery: SearchQuery | null | undefined,
    // The category of the current results page so suggestions can be told
    // apart from the current search
    currentCategoryKey?: string,
): OtherServicesSuggestionsState {
    const [state, setState] = useState<OtherServicesSuggestionsState>(
        {suggestions: [], isLoading: false}
    )
    const q = izzyQuery ? convertIzzySearchQueryToIss3(izzyQuery).q ?? "" : ""

    useEffect(() => {
        if (!q || !isRelatedSearchesConfigured()) {
            setState({suggestions: [], isLoading: false})
            return
        }
        setState({suggestions: [], isLoading: true})
        let cancelled = false
        Promise.all([fetchRelatedSearches(q), loadRelatedSearchFlows()])
            .then(([relatedSearches, flows]) => {
                if (!cancelled) {
                    setState({
                        suggestions: getOtherServicesSuggestions(
                            relatedSearches,
                            q,
                            flows,
                            currentCategoryKey,
                        ),
                        isLoading: false,
                    })
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
    }, [q, currentCategoryKey])

    return state
}
