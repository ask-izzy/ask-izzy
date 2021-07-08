/* @flow */

import React from "react";

import icons from "../icons";
import BaseLogoWithTextBox from "./BaseLogoWithTextBox";
import * as gtm from "../google-tag-manager";
import routerContext from "../contexts/router-context";

export default () => (
    <BaseLogoWithTextBox
        icon={<icons.OnlineSecurity className={"big middle"}/>}
        header={"Online Safety"}
        body={`There are some simple steps you can take
               which will make you safer online.`}
        highlightColor={"#70bdae"}
        path={"/online-safety"}
    />
)
