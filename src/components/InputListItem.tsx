import React from "react";

import ListItem, {Props as ListItemProps} from "@/src/components/ListItem";
import Button from "@/src/components/base/Button";
import type {AnalyticsEvent} from "@/src/google-tag-manager";
import Chevron from "@/src/icons/Chevron";

type Props = {
    type?: "checkbox" | "radio",
    checked?: boolean,
    value?: string,
    ariaLabel?: string,
    checkedIcon?: any,
    uncheckedIcon?: any,
    analyticsEvent?: AnalyticsEvent,
    readOnly?: boolean,
} & ListItemProps

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
}: Props) {
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
