/* @flow */

import React from "react";

import components from "../components";
import icons from "../icons";

class AppBar extends React.Component {
    props: Object;
    state: Object;
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        onBackTouchTap: React.PropTypes.func.isRequired,
    };

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

    renderBackButton(): ?React$Element {
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
