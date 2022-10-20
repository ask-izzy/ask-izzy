/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

type Props = {
    children?: any
}

function BoxedText({children}: Props): ReactNode {
    return (
        <div className="BoxedText">
            <div className="BoxedText-container">
                {children}
            </div>
        </div>
    )
}

export default BoxedText
