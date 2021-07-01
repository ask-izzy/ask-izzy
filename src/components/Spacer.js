/* @flow */

import React from "react";
import classnames from "classnames";

type Props = {
    className?: ?string
}

export default ({className}: Props) =>
    <hr className={classnames("Spacer", className)}/>
;
