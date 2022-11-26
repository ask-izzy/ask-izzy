import React from "react";
import classnames from "classnames";

import Button from "@/src/components/base/Button"
import type {AnalyticsEvent} from "@/src/google-tag-manager";

type Props = {
    label?: string,
    className?: string,
    onClick: () => void,
    disabled?: boolean,
    children?: any,
    type?: "primary" | "secondary" | "text" | "action"
    analyticsEvent?: AnalyticsEvent
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
    }: Props) {

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={classnames("StandardButton", className, `type-${type}`)}
            {...rest}
        >
            {label}
            {children}
        </Button>
    )

}

export default StandardButton
