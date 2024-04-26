import React, { useState } from 'react';
import FormatText from './FormatText';
import TooltipInformation from '@/src/components/TooltipInformation';
import Info from '../icons/Info';
import Accordion from "@/src/components/Accordion";
import Collapser from "@/src/components/general/Collapser";

type Props = {
    catchment: string,
    cost: string,
};

function Cost({ catchment, cost }: Props) {
    const [showAll, setShowAll] = useState(false);
    const isExceedingLimit = cost && cost.length > 100;
    const isToolTip = cost.toLowerCase().includes('inquire')

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    let costContent = cost;

    // If the description exceeds 100 characters, truncate it and display an accordion
    if (isExceedingLimit && !showAll) {
        costContent = (
            <>
                <Collapser
                    contentPreview= {cost.substring(0, 100)+"..."} 
                    expandMessage="Show all cost info"
                    analyticsEvent={{
                    event: `Action Triggered - Cost Info`,
                    eventAction: "show all cost info",
                     eventLabel: null,
                    }}
                    title="Show all cost info"
                    isOpen={showAll}
                    toggleAccordion={toggleShowAll}
                    items={[cost]}  
                >
                 <FormatText paragraphWrapperElement="p"> {cost} </FormatText>   
                </Collapser>
                
            </>
        );
    }

    // If the description contains "inquire", add a tooltip that explains a fee may be involved
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
                {cost.replace(/Inquire./gi, '')}  
            </>
        );
    }

    return (
        <div className="Cost">
            <div className="Cost">
                <h2 aria-label="Cost">
                    Cost
                </h2>
                <div className={isToolTip?"tooltip-caption":"Cost-desc"}>
                    {costContent} 
                </div>
            </div>
        </div>
    );
}

export default Cost;
