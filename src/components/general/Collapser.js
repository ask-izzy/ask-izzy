/* @flow */
import type {Element as ReactElement} from "React";
import React, { useState } from "react";
import type {Node as ReactNode} from "react"
import classnames from "classnames";

import Button from "../base/Button";
import type {AnalyticsEvent} from "../../google-tag-manager"

type Props = {
    className?: string,
    expandMessage: string,
    collapseMessage?: string,
    initiallyExpanded?: boolean,
    contentPreview?: ReactNode,
    children?: ReactNode,
    onClick?: Function,
    analyticsEvent?: AnalyticsEvent
}

// By default, if 'collapseMessage' is not defined, then the component will not
// display a button to collapse once it has been expanded.
export default function Collapser({
    className,
    expandMessage,
    collapseMessage,
    initiallyExpanded = false,
    contentPreview,
    children,
    onClick: onClickProp,
    analyticsEvent,
}: Props): ReactElement<"div"> {
    const [isCollapsed, setIsCollapsed] = useState(!initiallyExpanded)

    function onClick(event: SyntheticEvent<HTMLButtonElement>) {
        setIsCollapsed(!isCollapsed)
        onClickProp?.()
    }

    const message = isCollapsed ? expandMessage : collapseMessage

    return (
        <div
            className={classnames(
                "Collapser",
                className,
                {collapsed: isCollapsed}
            )}
        >
            {isCollapsed && contentPreview}
            {message &&
                <Button
                    alt={message}
                    className="collapser-message"
                    onClick={onClick}
                    analyticsEvent={{
                        event: `Action Triggered - Show Content`,
                        eventAction: "Show other content",
                        eventLabel: message,
                        eventValue: isCollapsed ? 1 : 0,
                        ...analyticsEvent,
                    }}
                >
                    {message}
                </Button>
            }
            <div
                className={classnames({collapsed: isCollapsed})}
            >
                {children}
            </div>
        </div>
    );
}
