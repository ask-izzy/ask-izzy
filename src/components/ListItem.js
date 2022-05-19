/* @flow */

import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "React";
import React from "react";
import classnames from "classnames";

type ListItemSpecific<T: React$AbstractComponent<Object, mixed> | string> = {
    rootElement?: T,
    className?: string,

    primaryText?: any,
    secondaryText?: any,

    leftIcon?: any,
    rightIcon?: any,

    children?: ReactNode,

    onClick?: (event?: SyntheticEvent<>) => any,
}
export type Props<T: React$AbstractComponent<Object, mixed> | string> =
    ListItemSpecific<T> & $Diff<ReactElementConfig<T>, {children: any | void}>

function ListItem<
    T: React$AbstractComponent<Object, mixed> | string
>({
    rootElement,
    className,
    children,
    leftIcon,
    rightIcon,
    primaryText,
    secondaryText,
    ...rest
}: Props<T>): ReactNode {
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
                }
            ),
            ...(rest: any),
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
        </div>
    );
}

export default ListItem