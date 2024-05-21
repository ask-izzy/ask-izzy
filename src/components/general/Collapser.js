/* @flow */
import type {Element as ReactElement} from "React";
import React, { useState } from "react";
import type {Node as ReactNode} from "react";
import classnames from "classnames";
import Chevron from "../../icons/Chevron";
import Button from "../base/Button";
import type {AnalyticsEvent} from "../../google-tag-manager";

type Props = {
    className?: string,
    expandMessage: string,
    collapseMessage?: string,
    initiallyExpanded?: boolean,
    contentPreview?: ReactNode,
    children?: ReactNode,
    onClick?: Function,
    analyticsEvent?: AnalyticsEvent,
};

function Collapser({
    className,
    expandMessage,
    collapseMessage,
    initiallyExpanded = false,
    contentPreview,
    children,
    onClick: onClickProp,
    analyticsEvent,
}: Props): ReactElement<"div"> {
    const [isCollapsed, setIsCollapsed] = useState(!initiallyExpanded);

    function onClick(event: SyntheticEvent<HTMLButtonElement>) {
        setIsCollapsed(!isCollapsed);
        onClickProp?.();
    }

    const message = isCollapsed ? expandMessage : collapseMessage;

    return (
        <div
            className={classnames("Collapser", className, { collapsed: isCollapsed })}
        >
            {isCollapsed && contentPreview}
            {message && (
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
                    <div className="title-container">
                        {message}
                        <Chevron />
                    </div>
                </Button>
            )}

            <div className={classnames("collapser-content", { collapsed: isCollapsed })}>
                {children}
            </div>
        </div>
    );
}

export default Collapser;
