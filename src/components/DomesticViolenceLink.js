/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import routerContext from "../contexts/router-context";
import * as gtm from "../google-tag-manager";

export default class DomesticViolenceLink extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <icons.Book className={"big middle"}/>,
        header: "Read more about domestic violence",
        body: `Do you know what domestic violence looks like? Learn more about
               how to spot the signs and what to do.`,
        highlightColor: "#7E74B3",
    };

    static contextType = routerContext;

    onClickBox(): void {
        const path = "/information";

        gtm.emit({
            event: "clickedInformationBanner",
            banner: "Domestic violence - hotline",
        });

        gtm.emit({
            event: "DV Banner Clicked",
            eventCat: "Banner Clicked",
            eventAction: "Domestic Violence Information",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        }, "GTM-54BTPQM");

        this.context.router.history.push(
            path,
        );
    }
}
