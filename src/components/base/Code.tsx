import React, {ReactNode, ReactElement} from "react"
import cnx from "classnames"

type Props = {
    children: ReactNode,
    className?: string
}

export default function Code(
    {className, ...rest}: Props,
): ReactElement<"code"> {
    return (
        <code
            {...rest}
            className={cnx("Code", className)}
        />
    )
}
