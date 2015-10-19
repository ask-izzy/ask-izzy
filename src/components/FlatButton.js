/* @flow */

import React from "react";

export default class FlatButton extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        label: React.PropTypes.string.isRequired,
        onTouchTap: React.PropTypes.func,
    };

    render(): ReactElement {
        return (
            <button
                className={`FlatButton ${this.props.className}`}
                onTouchTap={this.props.onTouchTap}
            >
                {this.props.label}
                {this.props.children}
            </button>
        )
    }
}
