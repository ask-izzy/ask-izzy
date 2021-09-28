/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
import ResultListItem from "../components/ResultListItem";
import CrisisLineItem from "../components/CrisisLineItem";
import CrisisHeader from "../components/CrisisHeader";
import {
    crisisResults,
    nonCrisisResults,
} from "../iss";

import type { Service } from "../iss";
import {useEffect, useState} from "react";

type Props = {
    results: Array<Service>,
    reFetchTravelTimes?: boolean,
}

function ResultsList({ results, reFetchTravelTimes = false}: Props): ReactNode {

    const [crisisResultList, setCrisisResultList] = useState([])
    const [nonCrisisResultList, setNonCrisisResultList] = useState([])

    useEffect(() => {
        setCrisisResultList(crisisResults(results))
        setNonCrisisResultList(nonCrisisResults(results))
    }, [results])


    return (
        <div className="ResultsList">
            {
                (crisisResultList.length > 0) &&
                <CrisisHeader
                    plural={crisisResultList.length > 1}
                />
            }
            {crisisResultList.map((crisis, index) => (
                <div
                    key={`crisis-${index}`}
                    className="resultContainer resultContainer-CrisisLineItem"
                >
                    <CrisisLineItem
                        object={crisis}
                        resultNumber={index + 1}
                    />
                </div>
            ))}
            {nonCrisisResultList.map((result, index) => (
                <div
                    key={`regular-${index}`}
                    className="resultContainer resultContainer-ResultListItem"
                >
                    <ResultListItem
                        reFetchTravelTimes={reFetchTravelTimes}
                        service={result}
                        resultNumber={index + 1}
                    />
                </div>
            ))}
        </div>
    );

}

export default ResultsList;
