/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import classnames from "classnames";

import Button from "@/src/components/base/Button"

type Props = {
    label?: string,
    className?: string,
    onClick: Function,
    disabled?: boolean,
    children?: any,
    type?: "primary" | "secondary" | "text" | "action"
}

function StandardButton(
    {
        label,
        className,
        onClick,
        disabled,
        children,
        type = "primary",
        ...rest
    }: Props): ReactElement<typeof Button> {

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={classnames("StandardButton", className, `type-${type}`)}
            {...(rest: any)}
        >
            {label}
            {children}
        </Button>
    )

}

export default StandardButton
