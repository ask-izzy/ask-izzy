/* @flow */
import React, {useContext, createContext, useState, useEffect} from "react";
import type {Node as ReactNode} from "react";
import storage from "../storage"

type Context = [
    boolean,
    ((boolean => boolean) | boolean) => void
]

const DebugModeContext: React$Context<Context> = createContext<Context>(
    [false, () => {}]
);

export default DebugModeContext

type ProviderProps = {
    children: ReactNode,
    initialDebugMode?: boolean
}

export const DebugModeProvider = (
    {children, initialDebugMode}: ProviderProps
): ReactNode => {
    const [debugMode, setDebugMode] = useState(initialDebugMode || false)

    function setDebugModePersistently(newDebugModeState) {
        setDebugMode(newDebugModeState)
        storage.setDebug(
            typeof newDebugModeState === "function" ?
                newDebugModeState(debugMode)
                : newDebugModeState
        )
    }

    // Wait till after the first render to enable debug mode if set to true in
    // storage. Otherwise the initial html structure rendered on the client-side
    // might not match the server-side rendered html structure and cause an when
    // hydrating.
    useEffect(() => {
        if (initialDebugMode === undefined) {
            setDebugMode(storage.getDebug())
        }
    }, [])

    if (typeof window !== "undefined") {
        window.pi = function() {
            setDebugModePersistently(!debugMode)
        }
    }

    const context = [debugMode, setDebugModePersistently]

    return (
        <DebugModeContext.Provider value={context}>
            {children}
        </DebugModeContext.Provider>
    )
}

export const useDebugModeContext = (): Context => useContext(DebugModeContext)
