/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import LogoShadow from "../icons/logo-shadow.svg";
import LogoLight from "../icons/logo-light.svg";

export default class LogoWithShadow extends React.Component<{}, void> {
    render(): ReactElement<"div"> {
        return (
            <div className="LogoWithShadow">
                <LogoShadow />
                <LogoLight />
            </div>
        )
    }
}
