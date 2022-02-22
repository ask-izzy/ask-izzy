/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

export type DiffType = Array<{
    added: boolean,
    removed: boolean,
    value: string
}>

type Props = {
    diff: DiffType,
    className?: string
}

export default function Diff({
    className,
    diff,
    ...rest
}: Props): ReactNode {
    return (
        <pre className={cnx(className, "Diff")}>
            {diff.map((sentence, i) => (
                <div
                    className={cnx({
                        added: sentence.added,
                        removed: sentence.removed,
                    })}
                    key={i + sentence.value}
                >{
                        sentence.value.split(/\n/).map((line, i) =>
                            <div
                                className="line"
                                key={i + line}
                            >{line}</div>
                        )
                    }</div>
            ))}
        </pre>
    )
}
