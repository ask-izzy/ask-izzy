/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";
import cnx from "classnames";
import ResultListItem from "../components/ResultListItem";
import CrisisLineItem from "../components/CrisisLineItem";
import CrisisHeader from "../components/CrisisHeader";
import {
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
    travelTimesStatus: travelTimesStatus,
    crisisResults: boolean,
    sortBy: ?SortType
}

function ResultsList({
    results,
    resultsLoading,
    travelTimesStatus,
    crisisResults,
    sortBy,
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

    return (
        <div className={cnx("ResultsList", {crisisResults})}>
            {crisisResults && filteredResults.length > 0 &&
                <CrisisHeader
                    plural={filteredResults.length > 1}
                />
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
