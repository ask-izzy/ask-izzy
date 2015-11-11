/* @flow */

import React from "react";
import classnames from "classnames";

export default class IconButton extends React.Component {
    static propTypes = {
        onTouchTap: React.PropTypes.func,
    };

    static sampleProps = {
        default: {
            children: "Button Text",
        },
    };

    render(): ReactElement {
        const {
            className,
            onTouchTap,
            children,
            ...rest,
        } = this.props;

        return (
            <button
                className={classnames("IconButton", className)}
                onTouchTap={onTouchTap}
                {...rest}
            >
                {children}
            </button>
        )
    }
}
