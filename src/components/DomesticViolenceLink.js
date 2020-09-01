/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import sendEvent from "../google-tag-manager";
import history from "../utils/history";

export default class DomesticViolenceLink extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <icons.Book className={"big middle"}/>,
        header: "Read more about domestic violence",
        body: `Do you know what domestic violence looks like? Learn more about
               how to spot the signs and what to do.`,
        highlightColor: "#7E74B3",
    };

    onClickBox(): void {
        const path = "/information";

        sendEvent({
            event: "clickedInformationBanner",
            banner: "Domestic violence - hotline",
        });

        history.push(
            path,
        );
    }
}
