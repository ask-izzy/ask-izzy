/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"

import Button from "@/src/components/base/Button"
import {useDebugModeContext} from "@/contexts/debug-mode-context";

type Props = {
    className?: string
}

export default function DebugModeOffSwitch({className}: Props): ReactNode {
    const [debugMode, setDebugMode] = useDebugModeContext()
    return debugMode ?
        (
            <Button
                className={cnx("DebugModeOffSwitch", className)}
                onClick={() => setDebugMode(false)}
            >
                Turn off debug mode
            </Button>
        )
        : null
}