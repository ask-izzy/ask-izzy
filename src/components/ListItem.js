/* @flow */

import type {Element} from "React";
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

    render(): Element<string> {
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
}
