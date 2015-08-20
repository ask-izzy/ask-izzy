/* @flow */
"use strict";

import React, { PropTypes } from "react";
import Router from "react-router";
import mui from "material-ui";

class HeaderBar extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        primaryText: PropTypes.string.isRequired,
        secondaryText: PropTypes.string,

        // FIXME: icon
    };

    render(): React.Element {
        return (
            <div className="HeaderBar">
                <div className="primary">
                    {this.props.primaryText}
                </div>
                <div className="secondary">
                    {this.props.secondaryText}
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default HeaderBar;
