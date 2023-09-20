/* @flow */

import type {Node as ReactNode} from "React"
import React from "react"

import Link from "./base/Link"
import Service from "../iss/Service"

type Props = {
    object: Service,
}

function Feedback({object}: Props): ReactNode {
    return (
        <div className="Feedback">
            <p>
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

                                `.replace(/^ +/gm, "")
                            )
                    }
                >
                    Report error
                </Link> if service details are incorrect.
            </p>
        </div>
    )
}

export default Feedback
