/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import DebugContainer from "./DebugContainer";

type Props = {
    object: Object
}

function DebugServiceRecord({object}: Props): ReactNode {
    // need to remove _explanation to get ...rest
    // Remove siblingServices to stop circle ref.
    /* eslint-disable no-unused-vars */
    const {_explanation, _siblingServices, ...rest} = object

    return (
        <DebugContainer message="ISS Object">
            <div className="DebugServiceRecord">
                <pre>{JSON.stringify(rest, null, 4)}</pre>
            </div>
        </DebugContainer>
    )
}

export default DebugServiceRecord
