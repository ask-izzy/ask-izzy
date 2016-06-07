/* @flow */

import React from "react";
import ListItem from "./ListItem";
import type { ListItemProps } from "./ListItem";

export default class InputListItem extends React.Component {
    props: ListItemProps & {
        type: "checkbox"|"radio",
        checked: boolean,
        value: string,
        checkedIcon: any,
        uncheckedIcon: any,
        onClick: Function,

        tabIndex?: number,
    };
    state: void;

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
