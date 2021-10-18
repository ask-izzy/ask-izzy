/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
import ResultListItem from "../components/ResultListItem";
import CrisisLineItem from "../components/CrisisLineItem";
import CrisisHeader from "../components/CrisisHeader";
import {
    crisisResults as onlyCrisisResults,
    nonCrisisResults as onlyNonCrisisResults,
} from "../iss";

import type {Service} from "../iss";
import type {SortType} from "./base/Dropdown";
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";

type Props = {
    results: Array<Service>,
    travelTimesStatus: travelTimesStatus,
    crisisResults: boolean,
    sortBy: ?SortType
}

function ResultsList({
    results,
    travelTimesStatus,
    crisisResults,
    sortBy,
}: Props): ReactNode {
    const filteredResults = crisisResults ?
        onlyCrisisResults(results)
        : onlyNonCrisisResults(results, sortBy)

    const ListItem: typeof CrisisLineItem | typeof ResultListItem =
        crisisResults ?
            CrisisLineItem
            : ResultListItem



    return (
        <div className="ResultsList">
            {crisisResults && filteredResults.length > 0 &&
                <CrisisHeader
                    plural={filteredResults.length > 1}
                />
            }
            {filteredResults.map((result, index) => (
                <ListItem
                    travelTimesStatus={travelTimesStatus}
                    service={result}
                    resultNumber={index + 1}
                    key={result.id}
                />
            ))}
        </div>
    );

}

export default ResultsList;
