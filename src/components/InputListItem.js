/* @flow */

import React from "react";
import ListItem from "./ListItem";
import type { ListItemProps } from "./ListItem";

type Props = ListItemProps & {
    type: "checkbox"|"radio",
    checked?: boolean,
    value?: string,
    checkedIcon: any,
    uncheckedIcon: any,

    tabIndex?: number,
}

export default class InputListItem extends React.Component<Props, void> {
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
            ...rest
        } = this.props;

        return (
            <ListItem
                className="InputListItem"
                rootElement="button"
                tabIndex={tabIndex || 0}
                {...{primaryText, secondaryText, leftIcon, onClick}}
                rightIcon={
                    <span>
                        {/* TODO: Find why this is throwing an error,
                            checked is collected from the props */}
                        {/* $FlowIgnore */}
                        {rest.checked ? checkedIcon : uncheckedIcon}
                        {/* @flow:enable */}
                        <input
                            ref="input"
                            key="input"
                            aria-label={primaryText}
                            {...(rest: any)}
                            tabIndex="-1"
                        />
                    </span>
                }
            />
        );

    }
}
