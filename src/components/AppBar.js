/* @flow */

import React from "react";
import classnames from "classnames";
import { History } from "react-router";
import reactMixin from "react-mixin";

import components from "../components";
import icons from "../icons";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class AppBar extends React.Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        onBackTouchTap: React.PropTypes.func.isRequired,
        backMessage: React.PropTypes.string,
        onForwardTouchTap: React.PropTypes.func,
        forwardMessage: React.PropTypes.string,
        forwardEnabled: React.PropTypes.bool,
        forwardIcon: React.PropTypes.node,
    };

    static defaultProps = {
        backMessage: "",
        forwardEnabled: true,
        forwardMessage: "",
        forwardIcon: (
            <icons.House
                aria-label="Home"
                className="small"
            />
        ),
    };

    static sampleProps = {default: {
        title: "App bar",
        onBackTouchTap: function() {},
    }};

    onForwardTouchTap(): void {
        if (this.props.onForwardTouchTap) {
            this.props.onForwardTouchTap();
        } else {
            this.history.pushState(
                null,
                "/",
                {}
            );
        }
    }

    render(): ReactElement {
        return (
            <div className="AppBar">
                {this.renderBackButton()}
                <h1 className="title">{this.props.title}</h1>
                {this.renderForwardButton()}
            </div>
        );
    }

    renderBackButton(): ReactElement {
        return (
            <components.IconButton
                className="BackButton button-container"
                onTouchTap={this.props.onBackTouchTap}
            >
                <div className="left">
                    <icons.ChevronBack aria-label="Back" />
                    <span className="back-label">
                        {this.props.backMessage}
                    </span>
                </div>
            </components.IconButton>
        )
    }

    renderForwardButton(): ?ReactElement {
        return (
            <components.IconButton
                className={classnames(
                    "NextButton",
                    "button-container",
                    {slideIn: this.props.slideForwardIn},
                )}
                onTouchTap={this.onForwardTouchTap.bind(this)}
                disabled={!this.props.forwardEnabled}
            >
                <div className="right">
                    <span className="next-label">
                        {this.props.forwardMessage}
                    </span>
                    {this.props.forwardIcon}
                </div>
            </components.IconButton>
        )
    }
}

export default AppBar;
