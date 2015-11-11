/* @flow */

import React from "react";
import { Link } from "react-router";
import classnames from "classnames";

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

        const {
            className,
            leftIcon,
            rightIcon,
            ...rest,
        } = this.props;
        const classes = classnames(
            "ListItem",
            "plain-text",
            className,
            {
                "has-right-icon": rightIcon,
                "has-left-icon": leftIcon,
            }
        )

        if (this.props.href) {
            // FIXME: react-router's <Link> can't handle the
            // 'mailto' scheme, because it tries to use pushstate.
            // To work around this, set 'href' instead of 'to'
            // to get an <a> instead of a <Link>
            return (
                <a
                    className={classes}
                    {...rest}
                >
                    {this.renderContent()}
                </a>
            );
        } else {
            return (
                <Link
                    className={classes}
                    {...rest}
                >
                    {this.renderContent()}
                </Link>
            );
        }
    }

    renderContent(): ReactElement {
        let {
            children,
            leftIcon,
            rightIcon,
            primaryText,
            secondaryText,
        } = this.props;

        return (
            <div>
                <div className="leftIcon">
                    {leftIcon}
                </div>
                {children ? null
                    : <div className="primaryText">
                        {primaryText}
                    </div>
                }
                {children ? null
                    : <div className="secondaryText">
                        {secondaryText}
                    </div>
                }
                {children}
                <div className="rightIcon">
                    {rightIcon}
                </div>
            </div>
        )
    }
}
