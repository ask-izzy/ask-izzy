import React from "react";

import Book from "@/src/icons/Book.js"
import LogoWithTextBox from "@/src/components/LogoWithTextBox.js";



export default function DomesticViolenceLink() {
    const path = "/information"

    return (
        <LogoWithTextBox
            icon={<Book className={"big middle"}/>}
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

