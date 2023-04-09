import React, {ForwardedRef, ReactNode} from "react"
import cnx from "classnames"

import * as gtm from "@/src/google-tag-manager.js"
import type {AnalyticsEvent} from "@/src/google-tag-manager.js"


export type Props = {
    children: ReactNode,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    analyticsEvent?: AnalyticsEvent,
    className?: string,
    onFocus?: () => void,
    onBlur?: () => void
    disabled?: boolean
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
    alt?: string
}

function Button({
    className,
    onClick: onClickFromParent,
    analyticsEvent,
    ...otherProps
}: Props, ref: ForwardedRef<HTMLButtonElement>) {
    function onClickHandler(event: React.MouseEvent<HTMLButtonElement>) {
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

export default (
    React.forwardRef<HTMLButtonElement, Props>(Button)
)
