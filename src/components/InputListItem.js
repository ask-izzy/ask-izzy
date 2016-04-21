/* @flow */

import React from "react";
import ListItem from "./ListItem";

export default class InputListItem extends React.Component {
    props: Object;
    state: Object;
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

    render() {
        let {
            checkedIcon,
            uncheckedIcon,
            primaryText,
            secondaryText,
            leftIcon,
            tabIndex,
            onClick,
            ...rest,
        } = this.props;

        return (
            <ListItem
                className="InputListItem"
                rootElement="a"
                href="#"
                tabIndex={tabIndex || 0}
                {...{primaryText, secondaryText, leftIcon, onClick}}
                rightIcon={
                    <span>
                        {rest.checked ? checkedIcon : uncheckedIcon}
                        <input
                            ref="input"
                            key="input"
                            // Avoid label of [object Object]
                            // aria-label={primaryText}
                            {...rest}
                            tabIndex="-1"
                        />
                    </span>
                }
            />
        );

    }
}
