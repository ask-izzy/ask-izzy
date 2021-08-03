/* @flow */

import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "React";
import React from "react";
import classnames from "classnames";

import Button from "./base/Button"

type Props ={
    onClick: Function,
    className?: string,
    name?: ?string,
    children: ReactNode,
} & ReactElementConfig<typeof Button>

export default class IconButton extends React.Component<Props, void> {
    render(): ReactNode {
        const {
            className,
            onClick,
            children,
            name,
            ...rest
        } = this.props;

        return (
            <Button
                {...rest}
                aria-label={name}
                className={classnames("IconButton", className)}
                onClick={onClick}
            >
                {children}
            </Button>
        )
    }
}
