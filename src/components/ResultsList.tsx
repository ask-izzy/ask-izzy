import React from "react";
import type {ReactNode} from "react";
import cnx from "classnames";
import ResultListItem from "../components/ResultListItem";
import CrisisLineItem from "../components/CrisisLineItem";
import CrisisHeader from "../components/CrisisHeader";
import {
    countCrisisResults,
    crisisResults as onlyCrisisResults,
    nonCrisisResults as onlyNonCrisisResults,
} from "../iss/crisisService";

import Service, {sortServices} from "../iss/Service";
import type {SortType} from "./base/Dropdown";
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import ScreenReader from "../components/ScreenReader"

type Props = {
    results: Array<Service>,
    resultsLoading: boolean,
    travelTimesStatus: travelTimesStatus | null | undefined,
    crisisResults: boolean,
    sortBy: SortType | null | undefined,
    // The number of results loaded at the end of each page of results
    pageBoundaries?: Array<number>,
    // Rendered after each page of (non-crisis) results
    renderAfterPage?: () => ReactNode,
}

function ResultsList({
    results,
    resultsLoading,
    travelTimesStatus,
    crisisResults,
    sortBy,
    pageBoundaries = [],
    renderAfterPage,
}: Props): ReactNode {

    let filteredResults = crisisResults ?
        onlyCrisisResults(results)
        : onlyNonCrisisResults(results)

    if (!crisisResults && sortBy) {
        filteredResults = sortServices(filteredResults, sortBy)
    }

    const ListItem: typeof CrisisLineItem | typeof ResultListItem =
        crisisResults ?
            CrisisLineItem
            : ResultListItem

    // Split the results into the pages they were loaded in so something can
    // be rendered between them. Crisis results are pulled out of the pages
    // and shown separately so they don't count towards a page's position.
    // See docs/other-services-panel.md § "Where the panel appears"
    function getPageRanges(): Array<[number, number]> {
        if (crisisResults || !renderAfterPage) {
            return [[0, filteredResults.length]]
        }
        const numOfCrisisResults = countCrisisResults(results)
        const pageEnds = pageBoundaries
            .map(boundary => Math.max(0, boundary - numOfCrisisResults))
            .filter(end => end > 0 && end < filteredResults.length)
        pageEnds.push(filteredResults.length)

        let start = 0
        const ranges: Array<[number, number]> = []
        for (const end of new Set(pageEnds)) {
            ranges.push([start, end])
            start = end
        }
        return ranges
    }

    return (
        <div className={cnx("ResultsList", {crisisResults})}>
            {crisisResults && filteredResults.length > 0 &&
                <CrisisHeader
                    plural={filteredResults.length > 1}
                />
            }
            {getPageRanges().map(([start, end], pageIndex) => (
                <React.Fragment key={pageIndex}>
                    {/*
                        role="list" here is needed since VoiceOver won't treat
                        lists as lists if they have list-style: none set
                        https://bugs.webkit.org/show_bug.cgi?id=170179
                    */}
                    <ol role="list"
                        start={start + 1}
                    >
                        {/*
                            We need at least one list item here until results
                            load otherwise VoiceOver won't treat this as a list
                            even after services have loaded.
                         */}
                        {resultsLoading && filteredResults.length === 0 &&
                            <li key={0}>
                                <ScreenReader>Loading services…</ScreenReader>
                            </li>
                        }
                        {filteredResults.slice(start, end).map((result, index) => (
                            <ListItem
                                travelTimesStatus={travelTimesStatus}
                                service={result}
                                resultNumber={start + index + 1}
                                key={result.id}
                            />
                        ))}
                    </ol>
                    {renderAfterPage && end > start && renderAfterPage()}
                </React.Fragment>
            ))}
        </div>
    );

}

export default ResultsList;
