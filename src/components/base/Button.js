/* @flow */
import type {Element as ReactElement} from "React";
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

import * as gtm from "../../google-tag-manager"
import type {AnalyticsEvent} from "../../google-tag-manager"
import type {HTMLElementProps} from "../../../flow/shared/html-elements"

type Props = {
    children: ReactNode,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => any,
    analyticsEvent?: AnalyticsEvent,
    className?: string,
} & HTMLElementProps

export default function Button({
    className,
    onClick: onClickFromParent,
    analyticsEvent,
    ...rest
}: Props): ReactElement<"button"> {
    function onClickHandler(event: SyntheticEvent<HTMLButtonElement>) {
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
            {...rest}
            className={cnx("Button", className)}
            onClick={onClickHandler}
        />
    )
}
