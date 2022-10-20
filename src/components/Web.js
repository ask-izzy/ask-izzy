/* @flow */
import type {Node as ReactNode} from "React"
import React from "react"
import URL from "url"

import Link from "./base/Link"
import icons from "../icons"
import * as gtm from "../google-tag-manager"
import type {AnalyticsEvent} from "../google-tag-manager"
import ScreenReader from "./ScreenReader"

type Props = {
    url: string,
    analyticsEventDetails?: AnalyticsEvent
}

function Web({
    url,
    analyticsEventDetails,
}: Props): ReactNode {
    const parsedUrl = URL.parse(url)
    const displayedAddress = (parsedUrl.hostname || "") +
            (!parsedUrl.path || (parsedUrl.path === "/") ? "" : parsedUrl.path)

    console.log(url, typeof url, url.toString())

    function recordClick(): void {
        gtm.emit({
            event: "Website Address Clicked",
            eventCat: "Website Address Clicked",
            eventAction: "",
            eventLabel: `${location.pathname} - ${url}`,
            sendDirectlyToGA: true,
            ...analyticsEventDetails,
        })
    }

    return (
        <div className="Contact Web">
            <ScreenReader>
                Service website:
            </ScreenReader>
            <Link
                to={parsedUrl.href}
                onClick={recordClick}
                analyticsEvent={{
                    event: "Link Followed - Website Contact",
                    eventAction: "Contact detail - website",
                    eventLabel: `${displayedAddress}`,
                }}
            >
                <icons.Website />
                <div className="Contact-text">
                    <span className="kind">
                        {" "}
                    </span>
                    <span className="web value">
                        {displayedAddress}
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default Web
