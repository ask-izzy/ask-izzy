/* @flow */
import type {Element as ReactElement} from "React";
import React, { useState } from "react";
import type {Node as ReactNode} from "react"
import classnames from "classnames";

type Props = {
    className?: string,
    expandMessage: string,
    collapseMessage?: string,
    initiallyExpanded?: boolean,
    contentPreview?: ReactNode,
    children?: ReactNode,
    onClick?: Function
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
}: Props): ReactElement<"div"> {
    const [isCollapsed, setIsCollapsed] = useState(!initiallyExpanded)

    function onClick(event: SyntheticInputEvent<>) {
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
                <button
                    alt={message}
                    className="collapser-message"
                    onClick={onClick}
                >
                    {message}
                </button>
            }
            <div
                className={classnames({collapsed: isCollapsed})}
            >
                {children}
            </div>
        </div>
    );
}
