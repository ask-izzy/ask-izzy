import type {ReactElement} from "react";
import React from "react"
import type {
    ReactNode,
    ComponentType as ReactAbstractComponent,
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
} & HTMLElementProps

type refType = { current: null | HTMLButtonElement } |
    ((arg0: null | HTMLButtonElement) => unknown)

function Button({
    className,
    onClick: onClickFromParent,
    analyticsEvent,
    ...otherProps
}: Props, ref?: refType | null | undefined): ReactElement<"button"> {
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
            // @ts-expect-error TODO(ts-migration): Type 'refType' is not assignable to type 'LegacyRef<HTMLButtonEleme…
            ref={ref}
        />
    )
}

export default (
    // @ts-expect-error TODO(ts-migration): Argument of type '({ className, onClick: onClickFromParent, analyticsEvent,…
    React.forwardRef<Props, HTMLButtonElement>(Button) as ReactAbstractComponent<Props>
)
