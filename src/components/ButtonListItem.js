/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ListItem from "./ListItem";
import type {Props as ListItemProps} from "./ListItem";
import Button from "./base/Button";

type PropsRest = {onClick: Function}

type Props = $Diff<
    ListItemProps<typeof Button>,
    $Exact<PropsRest> & {rootElement: any}
> & PropsRest



export default class ButtonListItem extends React.Component<Props, void> {
    render(): ReactNode {
        return <>
            <ListItem
                {...this.props}
                rootElement={Button}
                onClick={this.onClick.bind(this)}
            />
        </>
    }

    onClick(event: SyntheticEvent<HTMLButtonElement>): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
        event.preventDefault();
    }
}
