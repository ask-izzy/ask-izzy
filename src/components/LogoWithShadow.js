/* @flow */

import type {Element} from "React";
import React from "react";
import icons from "../icons";

export default class LogoWithShadow extends React.Component<{}, void> {
    render(): Element<"div"> {
        return (
            <div className="LogoWithShadow">
                <icons.LogoShadow />
                <icons.LogoLight />
            </div>
        )
    }
}
