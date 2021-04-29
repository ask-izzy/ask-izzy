/* @flow */

import React from "react";

import components from "../components";
import icons from "../icons";
import QuickExit from "./QuickExit";

type Props = {
    title?: ?string,
    onBackTouchTap?: ?Function,
    backMessage?: string,
    fixedSizeQuickExit?: boolean,
}

class AppBar extends React.Component<Props, void> {
    static sampleProps = {
        default: {
            title: "App bar",
            onBackTouchTap: function() {},
        },
    };


    render() {
        return (
            <div className="AppBarContainer">
                <div className="AppBar">
                    {this.props.onBackTouchTap ? this.renderBackButton() : null}
                    {this.props.title ?
                        <h1 className="title">{this.props.title}</h1>
                        : null}
                    <QuickExit fixedSize={this.props.fixedSizeQuickExit} />
                </div>
                <div className="AppBarSpacer" />
            </div>
        );
    }

    renderBackButton() {
        return (
            <components.IconButton
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
