/* @flow */
import type {Element as ReactElement} from "React";
import React from "react"
import type {
    Node as ReactNode,
    AbstractComponent as ReactAbstractComponent,
} from "react"
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

type refType = { current: null | HTMLButtonElement } |
    ((null | HTMLButtonElement) => mixed)

function Button({
    className,
    onClick: onClickFromParent,
    analyticsEvent,
    ...otherProps
}: Props, ref: ?refType): ReactElement<"button"> {
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
            {...otherProps}
            className={cnx("Button", className)}
            onClick={onClickHandler}
            ref={ref}
        />
    )
}

export default (
    React.forwardRef<Props, HTMLButtonElement>(Button):
        ReactAbstractComponent<Props, HTMLButtonElement>
)
