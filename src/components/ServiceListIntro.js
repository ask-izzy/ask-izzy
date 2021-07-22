/* @flow */

import React from "react";
import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import routerContext from "../contexts/router-context";

export default class ServiceListIntro extends BaseLogoWithTextBox {
    static defaultProps: any = {
        icon: <icons.Book className={"big middle"}/>,
        header: "Information and warning signs",
        body: `Do you know what domestic violence looks like? Learn
               more about how to spot the signs and what to do.`,
        highlightColor: "#887FBB",
        path: "/information",
    };

    static contextType: any = routerContext;

    onClickBox(): void {
        this.context.router.navigate(
            this.props.path,
        );
    }
}
