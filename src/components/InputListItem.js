/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ListItem from "./ListItem";
import Button from "./base/Button";
import type { Props as ListItemProps } from "./ListItem";
import type {AnalyticsEvent} from "../google-tag-manager";
import Chevron from "../icons/chevron.svg";

type Props = {
    type?: "checkbox" | "radio",
    checked?: boolean,
    value?: string,
    ariaLabel?: string,
    checkedIcon?: any,
    uncheckedIcon?: any,
    analyticsEvent?: AnalyticsEvent,
} & ListItemProps<typeof Button>

function InputListItem({
    checkedIcon,
    uncheckedIcon,
    primaryText,
    secondaryText,
    onClick,
    ariaLabel,
    rightIcon,
    type,
    checked,
    analyticsEvent,
    ...otherProps
}: Props): ReactNode {
    const label = ariaLabel || `${typeof primaryText === "string" ?
        `${primaryText}.` : ""} ${typeof secondaryText === "string" ?
        `${secondaryText}` : ""}`

    return (
        <ListItem
            {...otherProps}
            className="InputListItem"
            rootElement={Button}
            role={type || "button"}
            aria-label={label}
            tabIndex={0}
            rightIcon={!type ? rightIcon || <Chevron />
                : checked ? checkedIcon : uncheckedIcon
            }
            primaryText={primaryText}
            secondaryText={secondaryText}
            onClick={onClick}
            {...(typeof checked !== "undefined" ?
                {
                    checked,
                    "aria-checked": checked,
                }
                : {}
            )}
            analyticsEvent={{
                event: "Action Triggered - Option",
                eventAction: "Option selected",
                eventLabel: label,
                eventValue: checked ? 0 : 1,
                ...analyticsEvent,
            }}
        />
    );

}

export default InputListItem
