import type {ReactElement} from "react";
import React from "react";
import classnames from "classnames";

import Button from "@/src/components/base/Button"

type Props = {
    label?: string,
    className?: string,
    onClick: React.ComponentProps<typeof Button>["onClick"],
    disabled?: boolean,
    children?: any,
    type?: "primary" | "secondary" | "text" | "action",
    variant?: "default" | "icon"
} & Omit<React.ComponentProps<typeof Button>, "onClick" | "children" | "type">

function StandardButton(
    {
        label,
        className,
        onClick,
        disabled,
        children,
        type = "primary",
        variant = "default",
        ...rest
    }: Props): ReactElement<typeof Button> {

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={classnames("StandardButton", className, `type-${type}`, `variant-${variant}`)}
            {...rest}
        >
            {label}
            {children}
        </Button>
    )

}

export default StandardButton