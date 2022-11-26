import React from "react"

import Link from "@/src/components/base/Link"
import Service from "@/src/iss/Service"
import Spacer from "@/src/components/Spacer"

type Props = {
    object: Service,
}

function Feedback({object}: Props) {
    return (
        <div className="Feedback">
            <Spacer />
            <p>
                Email us at{" "}
                <Link
                    className="suggestChange"
                    analyticsEvent={{
                        event: `Input submitted - Feedback`,
                        eventCat: "Input submitted",
                        eventAction: `Feedback`,
                        eventLabel: "ServicePane feedback link",
                    }}
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
