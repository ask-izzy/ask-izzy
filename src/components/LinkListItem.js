/* @flow */

import React from "react";
import classnames from "classnames";

import Link from "./Link";
import ListItem from "./ListItem";
import type { ListItemProps } from "./ListItem";

type Props = ListItemProps & {
    to?: string,
    href?: string
}

export default class LinkListItem extends React.Component<Props, void> {
    static sampleProps = {
        default: {
            to: "example.com",
            ...ListItem.sampleProps,
        },
    };

    render() {
        const {
            className,
            ...rest
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
                {...(rest: any)}
            />
        );
    }
}
