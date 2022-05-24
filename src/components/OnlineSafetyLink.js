/* @flow */

import * as React from "react";

import icons from "../icons";
import LogoWithTextBox from "./LogoWithTextBox";

export default function OnlineSafetyLink(): React.Node {
    const path = "/online-safety"

    return (
        <LogoWithTextBox
            icon={<icons.OnlineSecurity className={"big middle"}/>}
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
