/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";

import Link from "./base/Link";
import type {AnalyticsEvent} from "../google-tag-manager";
import ScreenReader from "./ScreenReader";
import {MarkunreadRounded} from "@mui/icons-material";

type Props = {
    email: string,
    comment: string,
    analyticsEventDetails?: AnalyticsEvent
}

function Email({email, comment, analyticsEventDetails}: Props): ReactNode {
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
                <MarkunreadRounded aria-hidden={true}/>
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
