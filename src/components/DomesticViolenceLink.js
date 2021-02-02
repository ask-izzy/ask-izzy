/* @flow */

import React from "react";

import Book from "../icons/book.svg";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import sendEvent from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class DomesticViolenceLink extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <Book className={"big middle"}/>,
        header: "Read more about domestic violence",
        body: `Do you know what domestic violence looks like? Learn more about
               how to spot the signs and what to do.`,
        highlightColor: "#7E74B3",
    };

    static contextType = routerContext;

    onClickBox(): void {
        const path = "/information";

        sendEvent({
            event: "clickedInformationBanner",
            banner: "Domestic violence - hotline",
        });

        this.context.router.history.push(
            path,
        );
    }
}
