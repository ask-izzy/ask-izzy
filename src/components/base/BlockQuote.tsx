import type {ReactElement} from "react";
import React from "react"
import type {ReactNode} from "react"
import cnx from "classnames"

type Props = {
    children: ReactNode,
    className?: string
}

function BlockQuote(
    {className, ...rest}: Props
): ReactElement<"blockquote"> {
    return (
        <blockquote
            {...rest}
            className={cnx("BlockQuote", className)}
        />
    )
}

export default BlockQuote
