/* @flow */

import React from "react";
import PropTypes from "proptypes";
import classnames from "classnames";

type Props = {
    onClick: Function,
    className?: string,
    children?: any,
}

export default class IconButton extends React.Component<Props, void> {
    static propTypes = {
        onClick: PropTypes.func,
    };

    static sampleProps = {
        default: {
            children: "Button Text",
        },
    };

    render() {
        const {
            className,
            onClick,
            children,
        } = this.props;

        return (
            <button
                className={classnames("IconButton", className)}
                onClick={onClick}
            >
                {children}
            </button>
        )
    }
}
