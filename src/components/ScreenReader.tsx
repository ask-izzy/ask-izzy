import React from "react";

type Props = {
    children?: any;
    ariaLabel?: string | undefined;
};

function ScreenReader({children, ariaLabel}: Props) {
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
