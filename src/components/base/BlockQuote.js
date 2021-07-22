/* @flow */
import type {Element} from "React";
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

type Props = {
    children: ReactNode,
    className?: string
}

export default function BlockQuote(
    {className, ...rest}: Props
): Element<"blockquote"> {
    return (
        <blockquote
            {...rest}
            className={cnx("BlockQuote", className)}
        />
    )
}
