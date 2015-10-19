/* @flow */

import React from "react";

export default class ButtonListItem extends React.Component {
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
            className,
        ];

        if (leftIcon) {
            classes.push("has-left-icon");
        }

        if (rightIcon) {
            classes.push("has-right-icon");
        }

        return (
            <a
                aria-role="button"
                tabIndex="0"
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
            </a>
        )
    }
}
