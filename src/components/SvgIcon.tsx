import React from "react";
import classnames from "classnames";

type Props = {
    className?: string,
    viewBox?: string,
    children?: any,
}

function SvgIcon({
    className,
    viewBox = "0 0 24 24",
    children,
}: Props) {
    return (
        <svg
            className={classnames("SvgIcon", className)}
            viewBox={viewBox}
        >
            {children}
        </svg>
    );
}

export default SvgIcon;
