/* @flow */

import React from "react";

import components from "../components";
import icons from "../icons";

class AppBar extends React.Component {
    props: {
        title: string,
        onBackTouchTap: Function,
        backMessage?: string,
    };
    state: void;

    static sampleProps = {default: {
        title: "App bar",
        onBackTouchTap: function() {},
    }};

    render() {
        return (
            <div className="AppBarContainer">
                <div className="AppBar">
                    {this.renderBackButton()}
                    <h1 className="title">{this.props.title}</h1>
                    <div className="button-container force-centering" />
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
