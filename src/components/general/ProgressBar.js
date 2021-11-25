/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

type Props = {
    className?: string,
    current: number,
    total: number,
}

export default function ProgressBar({
    className,
    current,
    total,
    ...rest
}: Props): ReactNode {
    const progressPercentage = (current / total) * 100
    return (
        <div
            {...rest}
            className={cnx("ProgressBar", className)}
        >
            <div
                className="bar"
                style={{width: `${progressPercentage}%`}}
            />
        </div>
    )
}
