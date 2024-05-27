/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Collapser from "./general/Collapser";
import CurrentOpeningTime from "./CurrentOpeningTime";
import OpeningTimesList from "./OpeningTimesList";
import Service from "../iss/Service";

type Props = {
    service : Service
}

function CollapsedOpeningTimes({ service }: Props): ReactNode {
    return (
        <div className="CollapsedOpeningTimes">
            <CurrentOpeningTime serviceOpening={service.open} />
            {service.open.openingTimes.length > 0 && (
                <Collapser
                    expandMessage="Show open hours"
                    analyticsEvent={{
                        event: `Action Triggered - Opening Times`,
                        eventAction: "Show opening times",
                        eventLabel: null,
                    }}
                >
                    <div className="AllOpeningTimes">
                        <OpeningTimesList service={service}/>
                    </div>
                </Collapser>
            )}
        </div>
    )
}

export default CollapsedOpeningTimes;
