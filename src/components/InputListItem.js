/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import ListItem from "./ListItem";
import type { ListItemProps } from "./ListItem";

type Props = ListItemProps & {
    type: "checkbox"|"radio",
    checked?: boolean,
    value?: string,
    ariaLabel?: string,
    checkedIcon: any,
    uncheckedIcon: any,
}

export default class InputListItem extends React.Component<Props, void> {
    static sampleProps: any = {
        default: {
            type: "radio",
            ...ListItem.sampleProps,
        },
    };

    render(): ReactNode {
        let {
            checkedIcon,
            uncheckedIcon,
            primaryText,
            secondaryText,
            leftIcon,
            onClick,
            ariaLabel,
            ...rest
        } = this.props;

        const label = ariaLabel || `${typeof primaryText === "string" ?
            `${primaryText}.` : ""} ${typeof secondaryText === "string" ?
            `${secondaryText}` : ""}`

        return (
            <ListItem
                className="InputListItem"
                rootElement="button"
                role={this.props.type || "button"}
                aria-label={label}
                tabIndex="0"
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
                            aria-hidden="true"
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
