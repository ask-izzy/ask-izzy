/* @flow */

import React from "react";
import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";

export default class ChatAvailabilityBox extends BaseLogoWithTextBox {
    static defaultProps = Object.assign(
        {},
        BaseLogoWithTextBox.defaultProps,
        {
            classes: ["ChatAvailabilityBox"],
            icon: <icons.Book className={"big middle"}/>,
            header: "Chat to Izzy",
            body: `Instant answers for things nearby`,
            highlightColor: "#887FBB",
        }
    );

    onClickBox(): void {
        const path = "/chat";

        this.context.router.push(
            path,
        );
    }
}
