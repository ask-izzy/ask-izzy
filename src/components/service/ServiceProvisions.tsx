import React from "react";

import Collapser from "@/src/components/general/Collapser.js";
import Service from "@/src/iss/Service.js";

type Props = {
    service: Service
}

function ServiceProvisions({service}: Props) {
    const maxAboveFold = 4
    function provisions(): Array<string> {
        return service?.serviceProvisions || []
    }
    function provisionsAboveFold(): Array<string> {
        return provisions().slice(0, maxAboveFold)
    }
    function provisionsBelowFold(): Array<string> {
        return provisions().slice(maxAboveFold)
    }

    const renderProvisions = () =>
        <ul className="ServiceProvisions">
            {provisionsAboveFold().map((provision, i) =>
                <li className="provision aboveFold"
                    aria-label={`${provision}.`}
                    key={i}
                >
                    {provision}
                </li>,
            )}

            {provisionsBelowFold().length > 0 && (
                <Collapser
                    expandMessage={`${provisionsBelowFold().length} more…`}
                    analyticsEvent={{
                        event: `Action Triggered - Other Service Provisions`,
                        eventAction: "Show other service provisions",
                        eventLabel: null,
                    }}
                >
                    {provisionsBelowFold().map((provision, i) =>
                        <li className="provision"
                            aria-label={`${provision}.`}
                            key={i}
                        >
                            {provision}
                        </li>,
                    )}
                </Collapser>
            )}
        </ul>

    return (renderProvisions())
}

export default ServiceProvisions
