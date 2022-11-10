/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";

type Props = {
    children?: any,
    ariaLabel?: ?string,
}

function ScreenReader({children, ariaLabel}: Props): ReactNode {
    return (
        <div
            aria-label={ariaLabel}
            className="ScreenReader"
        >
            {children}
        </div>
    )
}

export default ScreenReader
