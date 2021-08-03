/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import classnames from "classnames";

import Link from "./base/Link";
import ListItem from "./ListItem";
import type {Props as ListItemProps} from "./ListItem";

type PropsRest = {onClick?: Function}

type Props = $Diff<
    ListItemProps<typeof Link>,
    $Exact<PropsRest> & {rootElement: any}
> & PropsRest

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
                {...rest}
                rootElement={Link}
                className={classnames(
                    "plain-text",
                    className,
                )}
            />
        );
    }
}
