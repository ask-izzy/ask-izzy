/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";

export default class OnlineSafetyLink extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <icons.OnlineSecurity className={"big middle"}/>,
        header: "Online Safety",
        body: `There are some simple steps you can take
               which will make you safer online.`,
        highlightColor: "#70bdae",
    };

    onClickBox(): void {
        const path = "/online-safety";

        this.context.router.push(
            path,
        );
    }
}
