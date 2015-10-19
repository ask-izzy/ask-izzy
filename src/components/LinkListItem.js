/* @flow */

import React from "react";
import { Link } from "react-router";

export default class LinkListItem extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        primaryText: React.PropTypes.node.isRequired,
        secondaryText: React.PropTypes.node,

        leftIcon: React.PropTypes.node,
        rightIcon: React.PropTypes.node,
    };

    // flow:disable not supported yet
    static defaultProps = {
        className: "",
    };

    render(): ReactElement {
        let {
            className,
            primaryText,
            secondaryText,
            leftIcon,
            rightIcon,
            ...rest,
        } = this.props;

        let classes = [
            "ListItem",
            "plain-text",
            className,
        ];

        if (leftIcon) {
            classes.push("has-left-icon");
        }

        if (rightIcon) {
            classes.push("has-right-icon");
        }

        return (
            <Link
                className={classes.join(" ")}
                {...rest}
            >
                <div>
                    <div className="leftIcon">
                        {leftIcon}
                    </div>
                    <div className="primaryText">
                        {primaryText}
                    </div>
                    <div className="secondaryText">
                        {secondaryText}
                    </div>
                    <div className="rightIcon">
                        {rightIcon}
                    </div>
                </div>
            </Link>
        )
    }
}
