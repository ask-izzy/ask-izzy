/* @flow */

import React from "react";
import { Link } from "react-router";

export default class LinkListItem extends React.Component {
    static propTypes = {
        primaryText: React.PropTypes.node,
        secondaryText: React.PropTypes.node,

        leftIcon: React.PropTypes.node,
        rightIcon: React.PropTypes.node,
    };

    static defaultProps = {
        className: "",
    };

    static sampleProps = {
        default: {
            primaryText: "Link Text",
            secondaryText: "Secondary Text",
            to: "example.com",
        },
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
                    {this.props.children ? null
                        : <div className="primaryText">
                            {primaryText}
                        </div>
                    }
                    {this.props.children ? null
                        : <div className="secondaryText">
                            {secondaryText}
                        </div>
                    }
                    {this.props.children}
                    <div className="rightIcon">
                        {rightIcon}
                    </div>
                </div>
            </Link>
        )
    }
}
