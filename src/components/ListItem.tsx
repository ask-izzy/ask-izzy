import React, {ReactNode} from "react";
import classnames from "classnames";

import type {AnalyticsEvent} from "@/src/google-tag-manager.js";


export type Props = {
    rootElement?: any
    className?: string
    primaryText?: any
    secondaryText?: any
    role?: any,
    leftIcon?: any
    rightIcon?: any
    children?: ReactNode
    onClick?: (event?: Event) => any
    analyticsEvent?: AnalyticsEvent
}

function ListItem({
    rootElement,
    className,
    children,
    leftIcon,
    rightIcon,
    primaryText,
    secondaryText,
    ...rest
}: Props) {
    if (!rootElement) {
        rootElement = "div";
    }

    return React.createElement(
        rootElement,
        {
            className: classnames(
                "ListItem",
                className,
                {
                    "has-left-icon": leftIcon,
                    "has-right-icon": rightIcon,
                },
            ),
            ...rest,
        },
        <div>
            {leftIcon && <div className="leftIcon">
                {leftIcon}
            </div>}

            <div className="label">
                {!children && <>
                    {primaryText && <div className="primaryText">
                        {primaryText}
                    </div>}
                    {primaryText && secondaryText && " "}
                    {secondaryText && <div className="secondaryText">
                        {secondaryText}
                    </div>}
                </>}
                {children}
            </div>
            {rightIcon && <div className="rightIcon">
                {rightIcon}
            </div>}
        </div>,
    )
}

export default ListItem