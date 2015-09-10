/* @flow */
"use strict";

import React from "react";
import mui from "material-ui";

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
    },};

    render(): React.Element {
        return (
            <mui.AppBar
                className="AppBar"
                title={this.props.title}
                iconElementLeft={
                    <mui.IconButton
                        className="BackButton"
                        onTouchTap={this.props.onBackTouchTap}
                    >
                        <icons.ChevronBack />
                    </mui.IconButton>
                }
            />
        );
    }
}

export default AppBar;
