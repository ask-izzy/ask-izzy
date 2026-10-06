import type {
    ReactNode,
    ComponentProps as ReactElementConfig,
} from "react";
import React from "react";
import classnames from "classnames";

type ListItemSpecific<T extends React.ComponentType<any> | string> = {
    rootElement?: T,
    className?: string,

    primaryText?: any,
    secondaryText?: any,

    leftIcon?: any,
    rightIcon?: any,

    children?: ReactNode,

    onClick?: (event?: React.SyntheticEvent) => any,
}
export type Props<T extends React.ComponentType<any> | string> =
    // @ts-expect-error TODO(ts-migration): Type 'T' does not satisfy the constraint 'JSXElementConstructor<any> | keyo…
    ListItemSpecific<T> & Omit<ReactElementConfig<T>, keyof {children: any | void}>

function ListItem<
    T extends React.ComponentType<any> | string
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
        // @ts-expect-error TODO(ts-migration): Type 'string' is not assignable to type 'T'.
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
            ...(rest as any),
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