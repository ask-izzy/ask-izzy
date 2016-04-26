/* @flow */

import React from "react";
import classnames from "classnames";

export default class IconButton extends React.Component {
    props: Object;
    state: Object;
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
            ...rest,
        } = this.props;

        return (
            <button
                className={classnames("IconButton", className)}
                onClick={onClick}
                {...rest}
            >
                {children}
            </button>
        )
    }
}
