/* @flow */

import React from "react";
import icons from "../icons";

export default class LogoWithShadow extends React.Component {
    render(): ReactElement {
        return (
            <div className="LogoWithShadow">
                <icons.LogoShadow />
                <icons.LogoLight />
            </div>
        )
    }
}
