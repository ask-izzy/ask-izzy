/* @flow */

import React from "react";
import { Link } from "react-router";
import classnames from "classnames";
import ListItem from "./ListItem";

export default class LinkListItem extends React.Component {
    static propTypes = {
        to: React.PropTypes.string,
        href: React.PropTypes.string,
        ...ListItem.propTypes,
    };

    static sampleProps = {
        default: {
            to: "example.com",
            ...ListItem.sampleProps,
        },
    };

    render(): ReactElement {
        const {
            className,
            ...rest,
        } = this.props;
        let rootElement = Link;

        if (this.props.href) {
            // FIXME: react-router's <Link> can't handle the
            // 'mailto' scheme, because it tries to use pushstate.
            // To work around this, set 'href' instead of 'to'
            // to get an <a> instead of a <Link>
            rootElement = "a"
        }

        return (
            <ListItem
                rootElement={rootElement}
                className={classnames(
                    "plain-text",
                    className,
                )}
                {...rest}
            />
        );
    }
}
