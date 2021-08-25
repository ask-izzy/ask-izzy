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
    rightIcon?: ReactNode,
}

function InputListItem(
    {
        checkedIcon,
        uncheckedIcon,
        primaryText,
        secondaryText,
        leftIcon,
        onClick,
        ariaLabel,
        rightIcon,
        type,
        checked,
    }: Props): ReactNode {


    const fetchLabel = (): string => (
        ariaLabel || `${typeof primaryText === "string" ?
            `${primaryText}.` : ""} ${typeof secondaryText === "string" ?
            `${secondaryText}` : ""}`
    )


    return (
        <ListItem
            className="InputListItem"
            rootElement="button"
            role={type || "button"}
            aria-label={fetchLabel()}
            tabIndex="0"
            rightIcon={!type ? rightIcon || <icons.Chevron />
                : checked ? checkedIcon : uncheckedIcon
            }
            {...{primaryText, secondaryText, leftIcon, onClick, checked}}
        />
    );

}

export default InputListItem
