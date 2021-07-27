/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import classnames from "classnames";

import Link from "./base/Link";
import ListItem from "./ListItem";
import type { ListItemProps } from "./ListItem";

type Props = ListItemProps & {
    to: string,
    onClick?: function
}

export default class LinkListItem extends React.Component<Props, void> {
    static sampleProps: any = {
        default: {
            to: "example.com",
            ...ListItem.sampleProps,
        },
    };

    render(): ReactNode {
        const {
            className,
            ...rest
        } = this.props;

        return (
            <ListItem
                rootElement={Link}
                {...rest}
                className={classnames(
                    "plain-text",
                    className,
                )}
            />
        );
    }
}
