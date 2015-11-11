/* @flow */

import React from "react";
import ListItem from "./ListItem";

export default class ButtonListItem extends React.Component {
    static propTypes = ListItem.propTypes;

    static sampleProps = ListItem.sampleProps;

    render(): ReactElement {
        return (
            <ListItem
                rootElement="a"
                aria-role="button"
                tabIndex="0"
                {...this.props}
            />
        );
    }
}
