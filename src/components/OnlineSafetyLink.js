/* @flow */

import React from "react";

import OnlineSecurity from "../icons/online-security.svg";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import sendEvent from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default class OnlineSafetyLink extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <OnlineSecurity className={"big middle"}/>,
        header: "Online Safety",
        body: `There are some simple steps you can take
               which will make you safer online.`,
        highlightColor: "#70bdae",
    };

    static contextType = routerContext;

    onClickBox(): void {
        const path = "/online-safety";

        sendEvent({
            event: "clickedInformationBanner",
            banner: "Online safety - are you safe?",
        });

        this.context.router.history.push(
            path,
        );
    }
}
