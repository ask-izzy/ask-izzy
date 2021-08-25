/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import * as gtm from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class OnlineSafetyLink extends BaseLogoWithTextBox {
    static defaultProps: any = {
        icon: <icons.OnlineSecurity className={"big middle"}/>,
        header: "Online Safety",
        body: `There are some simple steps you can take
               which will make you safer online.`,
        learnMoreLink: "Browsing safely online",
        highlightColor: "#70bdae",
        path: "/online-safety",
    };

    static contextType: any = routerContext;

    onClickBox(): void {
        gtm.emit({
            event: "Online Safety Banner Clicked",
            eventCat: "Banner Clicked",
            eventAction: "Online Safety",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        });

        this.context.router.navigate(
            this.props.path,
        );
    }
}
