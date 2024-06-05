import React, { useState, useEffect } from "react";
import type { Element as ReactElement, Node as ReactNode } from "react";
import classnames from "classnames";
import Chevron from "../../icons/Chevron";
import Button from "../base/Button";
import type { AnalyticsEvent } from "../../google-tag-manager";

type Props = {
    className?: string,
    header?: string,
    expandMessage: string,
    collapseMessage?: string,
    initiallyExpanded?: boolean,
    contentPreview?: ReactNode,
    children?: ReactNode,
    onClick?: Function,
    analyticsEvent?: AnalyticsEvent,
    onToggle?: (isCollapsed: boolean) => void,
    externalCollapsed?: boolean,
    icon?: ReactNode,
};

function Collapser({
    className,
    header,
    expandMessage,
    collapseMessage,
    initiallyExpanded = false,
    contentPreview,
    children,
    onClick: onClickProp,
    analyticsEvent,
    onToggle,
    externalCollapsed,
    icon,
}: Props): ReactElement<"div"> {
    const [isCollapsed, setIsCollapsed] = useState(!initiallyExpanded);

    useEffect(() => {
        if (typeof externalCollapsed === "boolean" && externalCollapsed !== isCollapsed) {
            setIsCollapsed(externalCollapsed);
        }
    }, [externalCollapsed]);

    useEffect(() => {
        if (onToggle) {
            onToggle(isCollapsed);
        }
    }, [isCollapsed]);

    function onClick(event: SyntheticEvent<HTMLButtonElement>) {
        setIsCollapsed(!isCollapsed);
        onClickProp?.();
    }

    const message = isCollapsed ? expandMessage : collapseMessage;

    return (
        <div className={classnames("Collapser", className, { collapsed: isCollapsed })}>
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
                        {header && <span className="collapser-header">{header}</span>}
                        <span className="collapser-message-text">{message}</span>
                        {icon || <Chevron />}
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
