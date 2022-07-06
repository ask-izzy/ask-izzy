/* @flow */

import * as React from "react";

import icons from "../icons";
import LogoWithTextBox from "./LogoWithTextBox";

export default function ServiceListIntro(): React.Node {
    return (
        <LogoWithTextBox
            icon={<icons.Book className={"big middle"}/>}
            header="Information and warning signs"
            body={`Do you know what domestic violence looks like? Learn
                more about how to spot the signs and what to do.`}
            highlightColor="#887FBB"
            path="/information"
        />
    )
}
