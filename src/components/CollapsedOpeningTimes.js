/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Collapser from "./general/Collapser";
import CurrentOpeningTime from "./CurrentOpeningTime.js";
import OpeningTimesList from "./OpeningTimesList";
import Service from "../iss/Service";

type Props = {
    service: Service,
    externalCollapsed?: boolean, // New prop for external control
    onToggle?: (isCollapsed: boolean) => void, // New prop for toggle handling
};

function CollapsedOpeningTimes({ service, externalCollapsed, onToggle }: Props): ReactNode {
    return (
        <div className="CollapsedOpeningTimes">
            <CurrentOpeningTime serviceOpening={service.open} />
            {service.open.openingTimes.length > 0 && (
                <Collapser
                    expandMessage="Show open times"
                    collapseMessage="Hide open times" // Add collapse message
                    analyticsEvent={{
                        event: `Action Triggered - Opening Times`,
                        eventAction: "Show opening times",
                        eventLabel: null,
                    }}
                    externalCollapsed={externalCollapsed} // Pass externalCollapsed prop
                    onToggle={onToggle} // Pass onToggle prop
                >
                    <div className="AllOpeningTimes">
                        <OpeningTimesList service={service} />
                    </div>
                </Collapser>
            )}
        </div>
    );
}

export default CollapsedOpeningTimes;
