import React, {useState, ReactNode} from "react"

import classnames from "classnames"
import Chevron from "@/src/icons/Chevron.js"
import Button from "@/src/components/base/Button.js"
import type {AnalyticsEvent} from "@/src/google-tag-manager.js"


type Props = {
    className?: string,
    expandMessage: string,
    collapseMessage?: string,
    initiallyExpanded?: boolean,
    contentPreview?: ReactNode,
    children?: ReactNode,
    onClick?: () => void,
    analyticsEvent?: AnalyticsEvent
}

// By default, if 'collapseMessage' is not defined, then the component will not
// display a button to collapse once it has been expanded.
function Collapser({
    className,
    expandMessage,
    collapseMessage,
    initiallyExpanded = false,
    contentPreview,
    children,
    onClick: onClickProp,
    analyticsEvent,
}: Props) {
    const [isCollapsed, setIsCollapsed] = useState(!initiallyExpanded)

    function onClick() {
        setIsCollapsed(!isCollapsed)
        onClickProp?.()
    }

    const message = isCollapsed ? expandMessage : collapseMessage

    return (
        <div
            className={classnames(
                "Collapser",
                className,
                {collapsed: isCollapsed},
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
                    <div className="title-container"> {/* wrapper for flex bug https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers */}
                        { message }
                        <Chevron />
                    </div>
                </Button>
            }

            <div
                className={classnames({collapsed: isCollapsed})}
            >
                {children}
            </div>
        </div>
    )
}

export default Collapser
