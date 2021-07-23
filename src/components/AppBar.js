/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import components from "../components";
import icons from "../icons";
import QuickExit from "./QuickExit";
import classnames from "classnames";
type Props = {
    title?: ?string,
    onBackTouchTap?: ?Function,
    backMessage?: string,
    fixedSizeQuickExit?: boolean,
    containerClassName?: ?string,
}

class AppBar extends React.Component<Props, void> {
    static sampleProps: any = {
        default: {
            title: "App bar",
            onBackTouchTap: function() {},
        },
    };


    render(): ReactElement<"div"> {
        return (
            <div
                className={
                    classnames(this.props.containerClassName, "AppBarContainer")
                }
            >
                <div className="AppBar">
                    {this.props.onBackTouchTap ? this.renderBackButton() : null}
                    {this.props.title ?
                        <h1 className="title">{this.props.title}</h1>
                        : null}
                    <QuickExit fixedSize={this.props.fixedSizeQuickExit} />
                </div>
                {this.props.onBackTouchTap ?
                    <div className="AppBarSpacer" />
                    : null}
            </div>
        );
    }

    renderBackButton(): ReactNode {
        return (
            <components.IconButton
                name={this.props.backMessage ? this.props.backMessage
                    : "back"}
                className="BackButton button-container"
                onClick={this.props.onBackTouchTap}
            >
                <icons.ChevronBack />
                <span className="back-label">
                    {this.props.backMessage}
                </span>
            </components.IconButton>
        )
    }
}

export default AppBar;
