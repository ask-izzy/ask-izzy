/* @flow */

import React from "react";
import ListItem from "./ListItem";
import type {ListItemProps} from "./ListItem";

/* eslint-disable-next-line max-len */
export default class ButtonListItem extends React.Component<ListItemProps, void> {
    static propTypes = ListItem.propTypes;

    static sampleProps = ListItem.sampleProps;

    render() {
        return (
            <ListItem
                rootElement="button"
                tabIndex="0"
                {...(this.props: any)}
                onClick={this.onClick.bind(this)}
            />
        );
    }

    onClick(event: SyntheticInputEvent<>): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
        event.preventDefault();
    }
}
