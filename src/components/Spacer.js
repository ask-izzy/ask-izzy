/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import classnames from "classnames";

type Props = {
    className?: ?string
}

export default ({className}: Props): ReactElement<"hr"> =>
    <hr className={classnames("Spacer", className)}/>
;
