/* @flow */
import type {Element} from "React";
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

type Props = {
    children: ReactNode,
    className?: string
}

export default function Code({className, ...rest}: Props): Element<"code"> {
    return (
        <code
            {...rest}
            className={cnx("Code", className)}
        />
    )
}
