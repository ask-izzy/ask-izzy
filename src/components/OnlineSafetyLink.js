/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import * as gtm from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class OnlineSafetyLink extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <icons.OnlineSecurity className={"big middle"}/>,
        header: "Online Safety",
        body: `There are some simple steps you can take
               which will make you safer online.`,
        highlightColor: "#70bdae",
    };

    static contextType = routerContext;

    onClickBox(): void {
        const path = "/online-safety";

        gtm.emit({
            event: "Online Safety Banner Clicked",
            eventCat: "Banner Clicked",
            eventAction: "Online Safety",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        });

        this.context.router.history.push(
            path,
        );
    }
}
