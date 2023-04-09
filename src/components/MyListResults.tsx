import React, {ReactNode} from "react";

import MyListResultItem from "@/src/components/MyListResultItem.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import Service from "@/src/iss/Service.js";


type Props = {
    results: Array<Service>,
    resultsLoading: boolean,
    children?: ReactNode,
}

function MyListResults({
    results,
    resultsLoading,
    children,
}: Props) {
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
                {results.flatMap((myListService, index) => {
                    const newList: any = []
                    newList.push(
                        <MyListResultItem
                            key={index}
                            service={myListService}
                            resultNumber={index + 1}
                        />,
                    )
                    return newList
                })}
            </ol>
            {children}
        </div>
    );

}

export default MyListResults;
