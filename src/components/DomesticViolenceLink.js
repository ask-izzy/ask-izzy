/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import * as gtm from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class DomesticViolenceLink extends BaseLogoWithTextBox {
    static defaultProps: any = {
        icon: <icons.Book className={"big middle"}/>,
        header: "Domestic and family violence information",
        body: `Do you know what domestic violence looks like?`,
        learnMoreLink: "Learn the signs and get help",
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
