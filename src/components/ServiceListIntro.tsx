import React from "react";

import Book from "@/src/icons/Book.js";
import LogoWithTextBox from "@/src/components/LogoWithTextBox.js";

export default function ServiceListIntro() {
    return (
        <LogoWithTextBox
            icon={<Book className={"big middle"}/>}
            header="Information and warning signs"
            body={`Do you know what domestic violence looks like? Learn
                more about how to spot the signs and what to do.`}
            highlightColor="#887FBB"
            path="/information"
        />
    )
}
