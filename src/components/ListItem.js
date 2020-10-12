/* @flow */

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
    static sampleProps = {
        default: {
            primaryText: "Link Text",
            secondaryText: "Secondary Text",
        },
    };

    render() {
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
                <div className="leftIcon">
                    {leftIcon}
                </div>
                {!children && (
                    <div className="text">
                        <div className="primaryText">
                            {primaryText}
                        </div>
                        <div className="secondaryText">
                            {secondaryText}
                        </div>
                    </div>
                )}
                {children}
                <div className="rightIcon">
                    {rightIcon}
                </div>
            </div>
        );
    }
}
