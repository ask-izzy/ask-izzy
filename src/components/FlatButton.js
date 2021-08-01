/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import classnames from "classnames";

type Props = {
    label?: string,
    className?: string,
    onClick: Function,
    disabled?: boolean,
    children?: any,
}

export default class FlatButton extends React.Component<Props, void> {
    static sampleProps: any = {
        default: {
            label: "Button Text",
        },
    };

    render(): ReactElement<"button"> {
        let {
            className,
            children,
            label,
            ...rest
        } = this.props;

        return (
            <button
                tabIndex="0"
                className={classnames("FlatButton", className)}
                {...(rest: any)}
            >
                {label}
                {children}
            </button>
        )
    }
}
