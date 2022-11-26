import React from "react";
import classnames from "classnames";

type Props = {
    className?: string | null
}

const spacer = ({className}: Props) =>
    <hr
        className={classnames("Spacer", className)}
        aria-hidden={true}
    />

export default spacer