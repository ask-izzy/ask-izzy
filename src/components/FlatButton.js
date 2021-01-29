/* @flow */

import React from "react";
import PropTypes from "proptypes";
import classnames from "classnames";

type Props = {
    label: string,
    className?: string,
    onClick: Function,
    disabled?: boolean,
    children?: any,
}

export default class FlatButton extends React.Component<Props, void> {
    static propTypes = {
        disabled: PropTypes.bool,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    static sampleProps = {
        default: {
            label: "Button Text",
        },
    };

    render() {
        let {
            className,
            children,
            label,
            ...rest
        } = this.props;

        return (
            <button
                className={classnames("FlatButton", className)}
                {...(rest: any)}
            >
                {label}
                {children}
            </button>
        )
    }
}
