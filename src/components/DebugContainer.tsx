import React from "react";

import Collapser from "@/src/components/general/Collapser.js";
import {useDebugModeContext} from "@/contexts/debug-mode-context.js";


type Props = {
    message: string,
    children?: any,
    initiallyExpanded?: boolean,
}
function DebugContainer({
    message,
    children,
    initiallyExpanded,
}: Props) {
    const [debugMode] = useDebugModeContext()
    if (!debugMode) {
        return null;
    }

    return (
        <div className="DebugContainer">
            <Collapser
                expandMessage={message}
                collapseMessage={message}
                initiallyExpanded={initiallyExpanded}
            >
                {children}
            </Collapser>
        </div>
    )
}

export default DebugContainer;
