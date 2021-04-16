/* @flow */

import React from "react";

import components from "../components";
import icons from "../icons";
import QuickExit from "./QuickExit";

type Props = {
    title: string,
    onBackTouchTap: Function,
    backMessage?: string,
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
                    {this.renderBackButton()}
                    <h1 className="title">{this.props.title}</h1>
                    <QuickExit />
                </div>
                <div className="AppBarSpacer"/>
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
