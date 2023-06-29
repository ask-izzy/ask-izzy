/* @flow */
import React, {useContext, createContext, useState, useEffect} from "react";
import type {Node as ReactNode} from "react";
import { useRouter } from "next/router"

import storage from "@/src/storage"

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

    const router = useRouter()

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
        const localStorageDebugModeValue = storage.getDebug()
        if (initialDebugMode === undefined && debugMode !== localStorageDebugModeValue) {
            setDebugMode(localStorageDebugModeValue)
        }
    }, [])

    // Enable debug mode if the user appends a particular hash to the current URL
    const onHashChanged = () => {
        if (window.location.hash === "#enable-debug-mode") {
            setDebugModePersistently(true);
            window.location.hash = "";
        }
    };
    useEffect(() => {
        window.addEventListener("hashchange", onHashChanged);
    
        return () => {
            window.removeEventListener("hashchange", onHashChanged);
        };
    }, []);
    useEffect(() => {
        // Check hash on initial page load
        if (router.isReady) {
            onHashChanged()
        }

    }, [router.isReady])


    // Toggle debug mode if the user calls a globally defined function using the browser's web console 
    if (typeof window !== "undefined" && !window.pi) {
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

/* Sometimes we need to find out if we're in debug mode outside
of react code and thus we don't have access to the debug mode
react context */
export function isDebugMode(): boolean {
    if (typeof window !== "undefined" && window.localStorage) {
        try {
            return JSON.parse(
                window.localStorage.getItem("debug")
            );
        } catch (error) {
            return false
        }
    }
    return false
}

export const useDebugModeContext = (): Context => useContext(DebugModeContext)
