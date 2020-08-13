/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import routerContext from "../contexts/router-context";
import * as gtm from "../google-tag-manager";

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
            event: "clickedInformationBanner",
            banner: "Online safety - are you safe?",
        });

        gtm.emit({
            event: "Online Safety Banner Clicked",
            eventCat: "Banner Clicked",
            eventAction: "Online Safety",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        }, "GTM-54BTPQM");

        this.context.router.history.push(
            path,
        );
    }
}
