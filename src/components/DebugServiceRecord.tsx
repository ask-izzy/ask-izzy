import React from "react";
import DebugContainer from "@/src/components/DebugContainer.js";

type Props = {
    object: any
}

function DebugServiceRecord({object}: Props) {
    // need to remove _explanation to get ...rest
    // Remove siblingServices to stop circle ref.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
