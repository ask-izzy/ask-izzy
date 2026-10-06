import type {ReactElement} from "react";
import React from "react";
import classnames from "classnames";

type Props = {
    className?: string | null | undefined
}

export default ({className}: Props): ReactElement<"hr"> =>
    <hr
        className={classnames("Spacer", className)}
        aria-hidden={true}
    />
