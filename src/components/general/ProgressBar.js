/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

type Props = {
    className?: string,
    current: number,
    total: number,
}

function ProgressBar({
    className,
    current,
    total,
    ...rest
}: Props): ReactNode {
    if (current > total) {
        console.error(
            `ProgressBar rendered with a higher current value ("${current}")` +
                `than total ("${total}")`
        )
    }
    if (total <= 0) {
        console.error(`ProgressBar rendered with a zero or negative total ` +
            `value ("${total}")`
        )
    }
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

export default ProgressBar