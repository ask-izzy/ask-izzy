/* @flow */

import type {
    Node as ReactNode,
    ElementConfig as ReactElementConfig,
} from "React";
import React from "react";
import classnames from "classnames";

type ListItemSpecific<T: React$AbstractComponent<Object, mixed>> = {
    rootElement?: T,
    className?: string,

    primaryText?: any,
    secondaryText?: any,

    leftIcon?: any,
    rightIcon?: any,

    children?: ReactNode,

    onClick?: (event?: SyntheticEvent<>) => any,
}
export type Props<T: React$AbstractComponent<Object, mixed>> =
    ListItemSpecific<T> & $Diff<ReactElementConfig<T>, {children: any | void}>

export default function ListItem<T: React$AbstractComponent<Object, mixed>>({
    rootElement,
    className,
    children,
    leftIcon,
    rightIcon,
    primaryText,
    secondaryText,
    ...rest
}: Props<T>): ReactNode {
    // Does the item have a checked property?
    // set the aria-checked attribute
    if (rest.hasOwnProperty("checked")) {
        // This is ignored because we don't
        // want this to set to every list-item when it
        // shouldn't be checkable to prevent it
        // from being read out by a screen reader
        /* $FlowIgnore */
        rest["aria-checked"] = rest.checked;
    }

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
