/* @flow */

import React from "react";
import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import history from "../utils/history";

export default class ServiceListIntro extends BaseLogoWithTextBox {
    static defaultProps = {
        icon: <icons.Book className={"big middle"}/>,
        header: "Information and warning signs",
        body: `Do you know what domestic violence looks like? Learn
               more about how to spot the signs and what to do.`,
        highlightColor: "#887FBB",
    };

    onClickBox(): void {
        const path = "/Information";

        history.push(
            path,
        );
    }
}
