/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

type Props = {
    title: string,
    className?: string,
    children: ReactNode,
}

export default function FormSection({
    title,
    className,
    children,
}: Props): ReactNode {
    return (
        <fieldset className={cnx("FormSection", className)}>
            <legend>{title}</legend>
            {children}
        </fieldset>
    )
}
