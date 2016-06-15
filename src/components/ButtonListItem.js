/* @flow */

import React from "react";
import ListItem from "./ListItem";
import type {ListItemProps} from "./ListItem";

export default class ButtonListItem extends React.Component {
    props: ListItemProps;
    state: void;
    static propTypes = ListItem.propTypes;

    static sampleProps = ListItem.sampleProps;

    render() {
        return (
            <ListItem
                rootElement="a"
                aria-role="button"
                role="button"
                tabIndex="0"
                href="#"
                {...this.props}
                onClick={this.onClick.bind(this)}
            />
        );
    }

    onClick(event: SyntheticInputEvent): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
        event.preventDefault();
    }
}
