/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";
import MyListResultItem from "../components/MyListResultItem";

import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import ScreenReader from "../components/ScreenReader";

type Props = {
    results: any, //change type to obj
    resultsLoading: boolean,
    travelTimesStatus: travelTimesStatus,
    extraInformation: function,
    children?: ReactNode,
}

function MyListResults({
    results,
    resultsLoading,
    travelTimesStatus,
    extraInformation,
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
                {resultsLoading && results.length === 0 &&
                    <li key={0}>
                        <ScreenReader>Loading services…</ScreenReader>
                    </li>
                }
                {extraInformation("top", "web")}
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
                    if (index === 0) {
                        newList.push(
                            <div key={0}>
                                {extraInformation("top", "mobile")}
                            </div>
                        )
                    }
                    return newList
                })}
            </ol>
            {children}
        </div>
    );

}

export default MyListResults;
