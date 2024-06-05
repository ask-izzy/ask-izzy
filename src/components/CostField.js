/* $FlowIgnore */

import React, { useState } from "react";
import FormatText from "./FormatText";
import Collapser from "@/src/components/general/Collapser";

type Props = {
    cost: string;
    hideContentPreview?: boolean; // Define hideContentPreview as an optional prop
};

function Cost({ cost, hideContentPreview }: Props) {
    if (cost === "") {
        return null; // Don't render the cost section if the data is "nothing"
    }

    const [showAll, setShowAll] = useState(false);
    const isExceedingLimit = cost && cost.length > 100;

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    let costContent = (
        <FormatText paragraphWrapperElement="p">{cost}</FormatText>
    );

    if (isExceedingLimit && !showAll && !hideContentPreview) { // Check if hideContentPreview is false
        costContent = (
            <Collapser
                contentPreview={cost.substring(0, 100) + "..."}
                expandMessage="Show all cost info"
                collapseMessage="Close expanded info"
                analyticsEvent={{
                    event: "Action Triggered - Cost Info",
                    eventAction: "show all cost info",
                    eventLabel: null,
                }}
                title="Show all cost info"
                isOpen={showAll}
                toggleAccordion={toggleShowAll}
                items={[cost]}
            >
                {costContent}
            </Collapser>
        );
    }

    return (
        <div className="Cost">
            <h2 aria-label="Cost">Cost</h2>
            {costContent}
        </div>
    );
}

export default Cost;