import React from "react";
import cnx from "classnames";

import ResultListItem from "@/src/components/ResultListItem";
import CrisisLineItem from "@/src/components/CrisisLineItem";
import CrisisHeader from "@/src/components/CrisisHeader";
import {
    crisisResults as onlyCrisisResults,
    nonCrisisResults as onlyNonCrisisResults,
} from "@/src/iss/crisisService";

import Service, {sortServices} from "@/src/iss/Service";
import type {SortType} from "@/src/components/base/Dropdown";
import type {travelTimesStatus} from "@/src/hooks/useTravelTimesUpdater";
import ScreenReader from "@/src/components/ScreenReader"

type Props = {
    results: Array<Service>,
    resultsLoading: boolean,
    travelTimesStatus: travelTimesStatus | null,
    crisisResults: boolean,
    sortBy: SortType | null | undefined
}

function ResultsList({
    results,
    resultsLoading,
    travelTimesStatus,
    crisisResults,
    sortBy,
}: Props) {

    let filteredResults = crisisResults ?
        onlyCrisisResults(results)
        : onlyNonCrisisResults(results)

    if (!crisisResults && sortBy) {
        filteredResults = sortServices(filteredResults, sortBy)
    }

    const ListItem: any =
        crisisResults ?
            CrisisLineItem
            : ResultListItem

    return (
        <div className={cnx("ResultsList", {crisisResults})}>
            {crisisResults && filteredResults.length > 0 &&
                <CrisisHeader />
            }
            {/*
                role="list" here is needed since VoiceOver won't treat
                lists as lists if they have list-style: none set
                https://bugs.webkit.org/show_bug.cgi?id=170179
            */}
            <ol role="list">
                {/*
                    We need at least one list item here until results load
                    otherwise VoiceOver won't treat this as a list even after
                    services have loaded.
                 */}
                {resultsLoading && filteredResults.length === 0 &&
                    <li key={0}>
                        <ScreenReader>Loading services…</ScreenReader>
                    </li>
                }
                {filteredResults.map((result, index) => (
                    <ListItem
                        travelTimesStatus={travelTimesStatus}
                        service={result}
                        resultNumber={index + 1}
                        key={result.id}
                    />
                ))}
            </ol>
        </div>
    );

}

export default ResultsList;
