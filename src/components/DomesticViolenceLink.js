/* @flow */

import * as React from "react";

import icons from "../icons";
import LogoWithTextBox from "./LogoWithTextBox";


export default function DomesticViolenceLink(): React.Node {
    const path = "/information"

    return (
        <LogoWithTextBox
            icon={<icons.Book className={"big middle"}/>}
            header="Domestic and family violence information"
            body="Do you know what domestic violence looks like?"
            learnMoreLink="Learn the signs and get help"
            highlightColor="#7E74B3"
            path={path}
            analyticsEvent={{
                event: "Link Followed - Callout",
                eventCat: "Link followed",
                eventAction: "Callout",
                eventLabel: "Domestic Violence",
                sendDirectlyToGA: true,
            }}
        />
    )
}

