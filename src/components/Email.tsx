import React from "react";

import Link from "@/src/components/base/Link.js";
import type {AnalyticsEvent} from "@/src/google-tag-manager.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import EmailIcon from "@/src/icons/Email.js";

type Props = {
    email: string,
    comment: string,
    analyticsEventDetails?: AnalyticsEvent
}

function Email({email, comment, analyticsEventDetails}: Props) {
    return (
        <div className="Contact Email">
            <ScreenReader>
                Email contact:
            </ScreenReader>
            <Link
                to={`mailto:${email}`}
                analyticsEvent={{
                    event: "Link Followed - Email Contact",
                    eventAction: "Contact detail - email",
                    eventLabel: `${email}`,
                    ...analyticsEventDetails,
                }}
            >
                <EmailIcon aria-hidden={true}/>
                <div className="Contact-text">
                    <span className="kind">
                        {comment}
                    </span>
                    {comment && " "}
                    <span className="email value">{email}</span>
                </div>
            </Link>
        </div>
    )
}

export default Email
