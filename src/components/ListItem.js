/* @flow */

import React from "react";
import classnames from "classnames";

export default class ListItem extends React.Component {
    props: Object;
    state: void;

    static propTypes = {
        rootElement: React.PropTypes.any,
        className: React.PropTypes.string,

        primaryText: React.PropTypes.node,
        secondaryText: React.PropTypes.node,

        leftIcon: React.PropTypes.node,
        rightIcon: React.PropTypes.node,
    };

    static defaultProps = {
        className: "",
        rootElement: "div",
    };

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
            ...rest,
        } = this.props;

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
                ...rest,
            },
            <div>
                <div className="leftIcon">
                    {leftIcon}
                </div>
                {children ? null
                : <div className="primaryText">
                    {primaryText}
                </div>}
                {children ? null
                : <div className="secondaryText">
                    {secondaryText}
                </div>}
                {children}
                <div className="rightIcon">
                    {rightIcon}
                </div>
            </div>
        );
    }
}
