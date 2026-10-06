import type {ReactElement} from "react";
import React from "react"
import type {
    ReactNode,
} from "react"
import cnx from "classnames"

import * as gtm from "../../google-tag-manager"
import type {AnalyticsEvent} from "../../google-tag-manager"
import type {HTMLElementProps} from "@/types/html-elements"

type Props = {
    children: ReactNode,
    onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => any,
    analyticsEvent?: AnalyticsEvent,
    className?: string,
} & HTMLElementProps & Omit<React.ComponentPropsWithoutRef<"button">, "onClick">

function Button({
    className,
    onClick: onClickFromParent,
    analyticsEvent,
    ...otherProps
}: Props, ref: React.ForwardedRef<HTMLButtonElement>): ReactElement<"button"> {
    function onClickHandler(event: React.SyntheticEvent<HTMLButtonElement>) {
        const buttonText = event.currentTarget.innerText || "<no text>"
        gtm.emit({
            event: `Action Triggered - Button`,
            eventCat: "Action triggered",
            eventAction: `Other button`,
            eventLabel: buttonText,
            sendDirectlyToGA: true,
            ...analyticsEvent,
        });
        onClickFromParent?.(event)
    }

    return (
        <button
            {...otherProps}
            className={cnx("Button", className)}
            onClick={onClickHandler}
            ref={ref}
        />
    )
}

export default React.forwardRef<HTMLButtonElement, Props>(Button)
