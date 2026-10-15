import React, { useState } from "react";
import type {ReactNode} from "react";
import FormatText from "./FormatText";
import Collapser from "@/src/components/general/Collapser";

type Props = {
    cost?: string | null;
};

function Cost({ cost }: Props) {
    if (!cost) {
        return null; // Don't render the cost section if the data is "nothing"
    }

    const [showAll] = useState(false);
    const isExceedingLimit = cost && cost.length > 100;

    let costContent: ReactNode = cost;

    if (isExceedingLimit && !showAll) {
        costContent = (
            <Collapser
                contentPreview={cost.substring(0, 100) + "..."}
                expandMessage="Show all cost info"
                collapseMessage="Close expanded info" // Added collapse message
                analyticsEvent={{
                    event: "Action Triggered - Cost Info",
                    eventAction: "show all cost info",
                    eventLabel: null,
                }}
            >
                <FormatText paragraphWrapperElement="p">{cost}</FormatText>
            </Collapser>
        );
    }

    return (
        <div className="Cost">
            <h2 aria-label="Cost">Cost</h2>
            <br /> <ul> <li> {costContent} </li> </ul>
        </div>
    );
}

export default Cost;
