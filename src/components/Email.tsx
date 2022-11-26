import React from "react";

import Link from "@/src/components/base/Link";
import * as gtm from "@/src/google-tag-manager";
import type {AnalyticsEvent} from "@/src/google-tag-manager";
import ScreenReader from "@/src/components/ScreenReader";
import EmailIcon from "@/src/icons/Email";

type Props = {
    email: string,
    comment: string,
    analyticsEventDetails?: AnalyticsEvent
}

function Email({email, comment, analyticsEventDetails}: Props) {
    function recordClick(): void {
        gtm.emit({
            event: "Email Clicked",
            eventCat: "Email Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${email}`,
            sendDirectlyToGA: true,
            ...analyticsEventDetails,
        })
    }

    return (
        <div className="Contact Email">
            <ScreenReader>
                Email contact:
            </ScreenReader>
            <Link
                to={`mailto:${email}`}
                onClick={recordClick}
                analyticsEvent={{
                    event: "Link Followed - Email Contact",
                    eventAction: "Contact detail - email",
                    eventLabel: `${email}`,
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
