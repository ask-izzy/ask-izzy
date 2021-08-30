/* @flow */
import type {Element as ReactElement} from "React";
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"
import "element-closest-polyfill"; // Polyfill for IE11

import * as gtm from "../../google-tag-manager"
import type {AnalyticsEvent} from "../../google-tag-manager"
import type {HTMLElementProps} from "../../../flow/shared/html-elements"

type Props = {
    children: ReactNode,
    onClick?: (event: SyntheticEvent<HTMLElement>) => any,
    analyticsEvent?: AnalyticsEvent,
    className?: string,
} & HTMLElementProps

export default function Summary({
    className,
    onClick: onClickFromParent,
    analyticsEvent,
    ...rest
}: Props): ReactElement<"summary"> {
    function onClickHandler(event: SyntheticEvent<HTMLElement>) {
        const summaryText = event.currentTarget.innerText || "<no text>"
        const detailsElement = (
            (event.currentTarget.closest("details"): any): ?HTMLDetailsElement
        )
        const isOpen = detailsElement?.open
        gtm.emit({
            event: `Action Triggered - Show Content`,
            eventCat: "Action triggered",
            eventAction: "Show other content",
            eventLabel: summaryText,
            eventValue: isOpen ? 0 : 1,
            sendDirectlyToGA: true,
            ...analyticsEvent,
        });
        onClickFromParent?.(event)
    }

    return (
        <summary
            {...rest}
            className={cnx("Summary", className)}
            onClick={onClickHandler}
        />
    )
}
