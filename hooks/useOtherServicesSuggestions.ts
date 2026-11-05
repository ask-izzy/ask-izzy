import {useEffect, useState} from "react"

import type {SearchQuery} from "@/src/iss/searchQueryBuilder"
import {convertIzzySearchQueryToIss3} from "@/src/iss/serviceSearch"
import {fetchRelatedSearches} from "@/src/iss/relatedSearches"
import {
    getOtherServicesSuggestions,
    loadRelatedSearchFlows,
} from "@/src/utils/other-services-suggestions"
import type {OtherServicesSuggestion} from "@/src/utils/other-services-suggestions"

/*
 * Suggestions for the "People also searched for" panel based on the ISS3 "q"
 * value of the current search. Empty until loaded, or if there aren't any.
 * See docs/other-services-panel.md § "Where suggestions come from"
 */
export default function useOtherServicesSuggestions(
    izzyQuery: SearchQuery | null | undefined,
): Array<OtherServicesSuggestion> {
    const [suggestions, setSuggestions] =
        useState<Array<OtherServicesSuggestion>>([])
    const q = izzyQuery ? convertIzzySearchQueryToIss3(izzyQuery).q ?? "" : ""

    useEffect(() => {
        setSuggestions([])
        if (!q) {
            return
        }
        let cancelled = false
        Promise.all([fetchRelatedSearches(q), loadRelatedSearchFlows()])
            .then(([relatedSearches, flows]) => {
                if (!cancelled) {
                    setSuggestions(
                        getOtherServicesSuggestions(relatedSearches, q, flows)
                    )
                }
            })
            .catch(error => {
                console.warn("Could not load other services suggestions", error)
            })
        return () => {
            cancelled = true
        }
    }, [q])

    return suggestions
}
