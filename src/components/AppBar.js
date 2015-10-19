/* @flow */

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
    }};

    render(): ReactElement {
        return (
            <div className="AppBar">
                <div className="left">
                    <mui.IconButton
                        className="BackButton"
                        onTouchTap={this.props.onBackTouchTap}

                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    >
                        <icons.ChevronBack />
                    </mui.IconButton>
                </div>
                <h1>{this.props.title}</h1>
            </div>
        );
    }
}

export default AppBar;
