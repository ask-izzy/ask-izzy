import React, {ReactNode} from "react";
import classnames from "classnames";

import Button, {Props as ButtonProps} from "@/src/components/base/Button"

type Props ={
    className?: string,
    onClick: () => void,
    name?: string | undefined,
    children: ReactNode,
} & ButtonProps

function IconButton({
    className,
    onClick,
    children,
    name,
    ...remainingProps
}: Props) {
    return (
        <Button
            aria-label={name}
            className={classnames("IconButton", className)}
            onClick={onClick}
            {...remainingProps}
        >
            {children}
        </Button>
    )

}

export default IconButton