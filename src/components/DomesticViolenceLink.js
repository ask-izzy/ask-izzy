/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import * as gtm from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class DomesticViolenceLink extends BaseLogoWithTextBox {
    static defaultProps: any = {
        icon: <icons.Book className={"big middle"}/>,
        header: "Read more about domestic violence",
        body: `Do you know what domestic violence looks like? Learn more about
               how to spot the signs and what to do.`,
        highlightColor: "#7E74B3",
        path: "/information",
    };

    static contextType: any = routerContext;

    onClickBox(): void {
        gtm.emit({
            event: "DV Banner Clicked",
            eventCat: "Banner Clicked",
            eventAction: "Domestic Violence Information",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        });

        this.context.router.navigate(
            this.props.path,
        );
    }
}
