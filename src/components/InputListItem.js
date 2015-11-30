/* @flow */

import React from "react";
import ListItem from "./ListItem";

export default class InputListItem extends React.Component {
    static propTypes = {
        type: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool,
        value: React.PropTypes.string,

        checkedIcon: React.PropTypes.node,
        uncheckedIcon: React.PropTypes.node,
        ...ListItem.propTypes,
    };

    static sampleProps = {
        default: {
            type: "radio",
            ...ListItem.sampleProps,
        },
    };

    render(): ReactElement {
        let {
            checkedIcon,
            uncheckedIcon,
            primaryText,
            secondaryText,
            leftIcon,
            ...rest,
        } = this.props;

        return (
            <ListItem
                rootElement="label"
                {...{primaryText, secondaryText, leftIcon}}
                rightIcon={
                    <span>
                        {rest.checked ? checkedIcon : uncheckedIcon}
                        <input
                            key="input"
                            aria-label={primaryText}
                            {...rest}
                        />
                    </span>
                }
            />
        );

    }
}
