import React from "react"

import OnlineSecurity from "@/src/icons/OnlineSecurity.js"
import LogoWithTextBox from "@/src/components/LogoWithTextBox.js"

export default function OnlineSafetyLink() {
    const path = "/online-safety"

    return (
        <LogoWithTextBox
            icon={<OnlineSecurity className={"big middle"}/>}
            header={"Online Safety"}
            body={`There are some simple steps you can take
                which will make you safer online.`}
            learnMoreLink="Browsing safely online"
            highlightColor="#70bdae"
            path={path}
            analyticsEvent={{
                event: "Link Followed - Callout",
                eventCat: "Link followed",
                eventAction: "Callout",
                eventLabel: "Online Safety",
                sendDirectlyToGA: true,
            }}
        />
    )
}
