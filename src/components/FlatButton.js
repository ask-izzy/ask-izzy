/* @flow */

import React from "react";

export default class FlatButton extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        disabled: React.PropTypes.bool,
        label: React.PropTypes.string.isRequired,
        onTouchTap: React.PropTypes.func,
    };

    // flow:disable not supported yet
    static sampleProps = {
        default: {
            label: "Button Text",
        },
    };

    render(): ReactElement {
        let {
            className,
            children,
            label,
            ...rest,
        } = this.props;

        return (
            <button
                className={`FlatButton ${className}`}
                {...rest}
            >
                {label}
                {children}
            </button>
        )
    }
}
