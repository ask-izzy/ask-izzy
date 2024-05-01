/* $FlowIgnore */

import React, { useState } from "react";
import FormatText from "./FormatText";
import TooltipInformation from "@/src/components/TooltipInformation";
import Info from "../icons/Info";
import Collapser from "@/src/components/general/Collapser";

type Props = {
    catchment: string;
    cost: string;
};

function Cost({ catchment, cost }: Props) {
    const [showAll, setShowAll] = useState(false);
    const isExceedingLimit = cost && cost.length > 100;
    const isToolTip = cost.toLowerCase().includes("inquire");

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    let costContent = cost;

    if (isExceedingLimit && !showAll) {
        costContent = (
            <Collapser
                contentPreview={cost.substring(0, 100) + "..."}
                expandMessage="Show all cost info"
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
                <FormatText paragraphWrapperElement="p">{cost}</FormatText>
            </Collapser>
        );
    }

    if (isToolTip) {
        costContent = (
            <>
                <div className="tooltip-wrapper">
                    <TooltipInformation
                        content="You may have to pay a fee to use this service. Contact them to find out more."
                    >
                        <div
                            className="info-icon-container"
                            aria-label="More information on cost"
                        >
                            <Info />
                        </div>
                    </TooltipInformation>
                    <h3 className="tooltip-caption">More info</h3>
                </div>
            </>
        );
    }

    return (
        <div className="Cost">
            <div className={isToolTip ? "tooltip-caption" : "Cost-desc"}>
                <h2 aria-label="Cost">Cost</h2>
                <br /> <ul> <li> {costContent} </li> </ul>
            </div>
        </div>
    );
}

export default Cost;