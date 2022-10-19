/* @flow */

import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "React";

import React from "react";
import classnames from "classnames";

import Button from "./base/Button"

type Props ={
    className?: string,
    onClick: Function,
    name?: ?string,
    children: ReactNode,
} & ReactElementConfig<typeof Button>

function IconButton({
    className,
    onClick,
    children,
    name,
    ...remainingProps
}: Props): ReactNode {
    return (
        <Button
            {...remainingProps}
            aria-label={name}
            className={classnames("IconButton", className)}
            onClick={onClick}
        >
            {children}
        </Button>
    )

}

export default IconButton