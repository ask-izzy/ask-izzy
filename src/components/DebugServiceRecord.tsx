import type {ReactNode} from "react";
import React from "react";
import DebugContainer from "./DebugContainer";

type Props = {
    object: any
}

function DebugServiceRecord({object}: Props): ReactNode {
    // Remove siblingServices to stop circle ref.
    /* eslint-disable no-unused-vars */
    const {_siblingServices, ...rest} = object

    return (
        <DebugContainer message="ISS Object">
            <div className="DebugServiceRecord">
                <pre>{JSON.stringify(rest, null, 4)}</pre>
            </div>
        </DebugContainer>
    )
}

export default DebugServiceRecord
