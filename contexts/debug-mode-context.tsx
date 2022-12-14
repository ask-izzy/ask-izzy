import React, {useContext, createContext, useState, useEffect, ReactNode} from "react";
import storage from "@/src/storage"

type Context = [
    boolean,
    (newDebugModeState: any) => void,
]

const DebugModeContext = createContext<Context>(
    [false, () => undefined],
);

type ProviderProps = {
    children: ReactNode,
    initialDebugMode?: boolean
}

export const DebugModeProvider = (
    {children, initialDebugMode}: ProviderProps,
) => {
    const [debugMode, setDebugMode] = useState(initialDebugMode || false)

    function setDebugModePersistently(newDebugModeState: any): void {
        setDebugMode(newDebugModeState)
        storage.setDebug(
            typeof newDebugModeState === "function" ?
                newDebugModeState(debugMode)
                : newDebugModeState,
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

    if (typeof window !== "undefined" && !window.pi) {
        window.pi = function() {
            setDebugModePersistently(!debugMode)
        }
    }

    const context: Context = [debugMode, setDebugModePersistently]

    return (
        <DebugModeContext.Provider value={context}>
            {children}
        </DebugModeContext.Provider>
    )
}

/* Sometimes we need to find out if we're in debug mode outside
of react code and thus we don't have access to the debug mode
react context */
export function isDebugMode(): boolean {
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            return JSON.parse(
                window.localStorage.getItem("debug"),
            );
        } catch (error) {
            return false
        }
    }
    return false
}

export const useDebugModeContext = (): Context => useContext(DebugModeContext)
