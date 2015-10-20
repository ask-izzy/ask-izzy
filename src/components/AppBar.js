/* @flow */

import React from "react";

import components from "../components";
import icons from "../icons";

class AppBar extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        onBackTouchTap: React.PropTypes.func.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {default: {
        title: "App bar",
        onBackTouchTap: function() {},
    }};

    render(): ReactElement {
        return (
            <div className="AppBar">
                <div className="left">
                    <components.IconButton
                        className="BackButton"
                        onTouchTap={this.props.onBackTouchTap}
                    >
                        <icons.ChevronBack />
                    </components.IconButton>
                </div>
                <h1>{this.props.title}</h1>
            </div>
        );
    }
}

export default AppBar;
