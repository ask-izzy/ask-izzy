/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import ListItem from "./ListItem";
import type { ListItemProps } from "./ListItem";
import icons from "../icons";

type Props = ListItemProps & {
    type?: "checkbox"|"radio"|null,
    checked?: boolean,
    value?: string,
    ariaLabel?: string,
    checkedIcon?: any,
    uncheckedIcon?: any,
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
                {...{primaryText, secondaryText, leftIcon, onClick,
                    "aria-checked": rest.checked}}
                rightIcon={!rest?.type ? <icons.Chevron />
                    : rest?.checked ? checkedIcon : uncheckedIcon
                }
            />
        );

    }
}
