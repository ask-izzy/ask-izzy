/* @flow */

import React from "react";

export default class FlatButton extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        disabled: React.PropTypes.boolean,
        label: React.PropTypes.string.isRequired,
        onTouchTap: React.PropTypes.func,
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
