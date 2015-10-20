/* @flow */

import React from "react";

export default class IconButton extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        onTouchTap: React.PropTypes.func,
    };

    // flow:disable not supported yet
    static sampleProps = {
        default: {
            children: "Button Text",
        },
    };

    render(): ReactElement {
        return (
            <button
                className={`IconButton ${this.props.className}`}
                onTouchTap={this.props.onTouchTap}
            >
                {this.props.children}
            </button>
        )
    }
}
