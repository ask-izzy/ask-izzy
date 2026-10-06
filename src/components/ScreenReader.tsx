import type {ReactNode} from "react";
import React from "react";

type Props = {
    children?: any,
    ariaLabel?: string | null | undefined,
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
