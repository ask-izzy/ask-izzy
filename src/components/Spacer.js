/* @flow */

import type {Element} from "React";
import React from "react";
import classnames from "classnames";

type Props = {
    className?: ?string
}

export default ({className}: Props): Element<"hr"> =>
    <hr className={classnames("Spacer", className)}/>
;
