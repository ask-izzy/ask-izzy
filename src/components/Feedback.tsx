import React from "react"

import Link from "@/src/components/base/Link.js"
import * as gtm from "@/src/google-tag-manager.js"
import Service from "@/src/iss/Service.js"
import Spacer from "@/src/components/Spacer.js"

type Props = {
    object: Service,
}

function Feedback({object}: Props) {
    function recordSuggestChange(): void {
        gtm.emit({
            event: "Service Change Requested",
            eventCat: "Feedback Given",
            eventAction: "Service Change Suggestion",
            eventLabel: location.pathname,
            eventValue: object.id,
            sendDirectlyToGA: true,
        })
    }

    return (
        <div className="Feedback">
            <Spacer />
            <p>
                Email us at{" "}
                <Link
                    className="suggestChange"
                    onClick={recordSuggestChange}
                    to={
                        `mailto:${process.env.NEXT_PUBLIC_SITE_EMAIL}` +
                            "?subject=" +
                            encodeURIComponent(
                                `Your Ask Izzy feedback: ` +
                            `${object.id}`) +
                            "&body=" +
                            encodeURIComponent(
                                `Contact name:

                                Contact number:

                                Contact email:

                                Details of change:

                                `.replace(/^ +/gm, ""),
                            )
                    }
                >
                    {process.env.NEXT_PUBLIC_SITE_EMAIL}
                </Link> with feedback or changes to service information
                if details here need updating.
            </p>
        </div>
    )
}

export default Feedback
