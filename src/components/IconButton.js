/* @flow */

import React from "react";
import classnames from "classnames";

export default class IconButton extends React.Component {
    props: {
        onClick: Function,
        className?: string,
        children?: any,
    };
    state: void;
    static propTypes = {
        onClick: React.PropTypes.func,
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
