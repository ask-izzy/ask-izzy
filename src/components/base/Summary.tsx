import React, {ReactNode} from "react"
import cnx from "classnames"
import "element-closest-polyfill" // Polyfill for IE11

import * as gtm from "@/src/google-tag-manager.js"
import type {AnalyticsEvent} from "@/src/google-tag-manager.js"

type Props = {
    children: ReactNode,
    onClick?: (event: React.SyntheticEvent<HTMLElement>) => any,
    analyticsEvent?: AnalyticsEvent,
    className?: string,
    tabIndex?: number,
}

export default function Summary({
    className,
    onClick: onClickFromParent,
    analyticsEvent,
    ...rest
}: Props) {
    function onClickHandler(event: React.SyntheticEvent<HTMLElement>) {
        const summaryText = event.currentTarget.innerText || "<no text>"
        const detailsElement = event.currentTarget.closest("details")
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
