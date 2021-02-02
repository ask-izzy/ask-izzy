/* @flow */

import React from "react";
import Book from "../icons/book.svg";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import routerContext from "../contexts/router-context";

export default class ServiceListIntro extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <Book className={"big middle"}/>,
        header: "Information and warning signs",
        body: `Do you know what domestic violence looks like? Learn
               more about how to spot the signs and what to do.`,
        highlightColor: "#887FBB",
    };

    static contextType = routerContext;

    onClickBox(): void {
        const path = "/Information";

        this.context.router.history.push(
            path,
        );
    }
}
