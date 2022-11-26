import React from "react"
import URL from "url"

import Link from "@/src/components/base/Link"
import Website from "@/src/icons/Website"
import * as gtm from "@/src/google-tag-manager"
import type {AnalyticsEvent} from "@/src/google-tag-manager"
import ScreenReader from "@/src/components/ScreenReader"

type Props = {
    url: string,
    analyticsEventDetails?: AnalyticsEvent
}

function Web({
    url,
    analyticsEventDetails,
}: Props) {
    const parsedUrl = URL.parse(url)
    const displayedAddress = (parsedUrl.hostname || "") +
            (!parsedUrl.path || (parsedUrl.path === "/") ? "" : parsedUrl.path)

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
                <Website />
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
