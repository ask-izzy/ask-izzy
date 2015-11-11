/* @flow */

import React from "react";
import classnames from "classnames";

export default class FlatButton extends React.Component {
    static propTypes = {
        disabled: React.PropTypes.bool,
        label: React.PropTypes.string.isRequired,
        onTouchTap: React.PropTypes.func,
    };

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
                className={classnames("FlatButton", className)}
                {...rest}
            >
                {label}
                {children}
            </button>
        )
    }
}
