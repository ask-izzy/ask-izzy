import type {ReactElement} from "react";
import React from "react";
import icons from "../icons";

export default class LogoWithShadow extends React.Component<{}, void> {
    render(): ReactElement<"div"> {
        return (
            <div className="LogoWithShadow">
                <icons.LogoShadow />
                <icons.LogoLight />
            </div>
        )
    }
}
