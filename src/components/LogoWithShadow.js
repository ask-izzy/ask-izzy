/* @flow */

import React from "react";
import LogoShadow from "../icons/logo-shadow.svg";
import LogoLight from "../icons/logo-light.svg";

export default class LogoWithShadow extends React.Component<{}, void> {
    render() {
        return (
            <div className="LogoWithShadow">
                <LogoShadow />
                <LogoLight />
            </div>
        )
    }
}
