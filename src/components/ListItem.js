/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import classnames from "classnames";

export type ListItemProps = {
    rootElement?: string,
    className?: string,

    primaryText?: any,
    secondaryText?: any,

    leftIcon?: any,
    rightIcon?: any,

    children?: any,

    onClick?: Function,
}

export default class ListItem extends React.Component<ListItemProps, void> {
    static sampleProps: any = {
        default: {
            primaryText: "Link Text",
            secondaryText: "Secondary Text",
        },
    };

    render(): ReactElement<string> {
        let {
            rootElement,
            className,
            children,
            leftIcon,
            rightIcon,
            primaryText,
            secondaryText,
            ...rest
        } = this.props;

        // does the item have a checked property?
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
                        {primaryText &&
                        <div
                            className="primaryText"
                        >
                            {primaryText}
                        </div>}
                        {secondaryText &&
                        <div
                            className="secondaryText"
                        >
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
}
