/* @flow */

import React from "react";
import classnames from "classnames";

import components from "../components";
import icons from "../icons";

class AppBar extends React.Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        onBackTouchTap: React.PropTypes.func.isRequired,
        onForwardTouchTap: React.PropTypes.func,
        forwardMessage: React.PropTypes.string,
        forwardEnabled: React.PropTypes.bool,
        forwardIcon: React.PropTypes.node,
    };

    static defaultProps = {
        forwardEnabled: true,
        forwardMessage: "",
        forwardIcon: <icons.Chevron />,
    };

    static sampleProps = {default: {
        title: "App bar",
        onBackTouchTap: function() {},
    }};

    render(): ReactElement {
        return (
            <div className="AppBar">
                <components.IconButton
                    className="BackButton button-container"
                    onTouchTap={this.props.onBackTouchTap}
                >
                    <icons.ChevronBack className="left" />
                </components.IconButton>
                <h1 className="title">{this.props.title}</h1>
                {this.renderForwardButton()}
            </div>
        );
    }

    renderForwardButton(): ?ReactElement {
        if (this.props.onForwardTouchTap) {
            return (
                <components.IconButton
                    className={classnames(
                        "NextButton",
                        "button-container",
                        {slideIn: this.props.slideForwardIn},
                    )}
                    onTouchTap={this.props.onForwardTouchTap}
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
        } else {
            return (
                <div className="button-container">
                    <div className="right">
                    </div>
                </div>
            )
        }
    }
}

export default AppBar;
