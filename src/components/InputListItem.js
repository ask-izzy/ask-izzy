/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ListItem from "./ListItem";
import Button from "./base/Button";
import type { Props as ListItemProps } from "./ListItem";
import type {AnalyticsEvent} from "../google-tag-manager";
import icons from "../icons";

type Props = ListItemProps<typeof ListItem> & {
    type?: "checkbox"|"radio",
    checked?: boolean,
    value?: string,
    ariaLabel?: string,
    checkedIcon?: any,
    uncheckedIcon?: any,
    rightIcon?: ReactNode,
    analyticsEvent?: AnalyticsEvent,
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
        analyticsEvent,
    }: Props): ReactNode {

    const listItemProps = {
        primaryText,
        secondaryText,
        leftIcon,
        onClick,
        analyticsEvent: {
            event: "Action Triggered - Option",
            eventAction: "Option selected",
            ...analyticsEvent,
        },
    }

    return (
        <ListItem
            className="InputListItem"
            rootElement={Button}
            role={type || "button"}
            aria-label={ariaLabel || `${typeof primaryText === "string" ?
                `${primaryText}.` : ""} ${typeof secondaryText === "string" ?
                `${secondaryText}` : ""}`}
            tabIndex={0}
            {...listItemProps}
            rightIcon={!type ? rightIcon || <icons.Chevron />
                : checked ? checkedIcon : uncheckedIcon
            }
            primaryText={primaryText}
            secondaryText={secondaryText}
            leftIcon={leftIcon}
            onClick={onClick}
            checked={checked}
            analyticsEvent={{
                event: "Action Triggered - Option",
                eventAction: "Option selected",
                ...analyticsEvent,
            }}
        />
    );

}

export default InputListItem
