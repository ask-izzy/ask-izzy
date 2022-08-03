/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
import MyListResultItem from "../components/MyListResultItem";

import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import ScreenReader from "../components/ScreenReader";
import Service from "../iss/Service";

type Props = {
    results: {string: Service},
    resultsLoading: boolean,
    travelTimesStatus: travelTimesStatus,
    children?: ReactNode,
}

function MyListResults({
    results,
    resultsLoading,
    travelTimesStatus,
    children,
}: Props): ReactNode {
    return (
        <div className="MyListResults">
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
                {resultsLoading && Object.keys(results).length === 0 &&
                    <li key={0}>
                        <ScreenReader>Loading services…</ScreenReader>
                    </li>
                }
                {Object.keys(results).flatMap((key, index) => {
                    const newList = []
                    newList.push(
                        <MyListResultItem
                            key={key}
                            travelTimesStatus={travelTimesStatus}
                            service={results[key]}
                            resultNumber={index + 1}
                        />
                    )
                    return newList
                })}
            </ol>
            {children}
        </div>
    );

}

export default MyListResults;
