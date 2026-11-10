import {useEffect, useState} from "react"

import Storage from "@/src/storage"
import {useDebugModeContext} from "@/contexts/debug-mode-context"

// How many results into the first page the extra other services panel goes.
// See docs/other-services-panel.md § "Where the panel appears"
export const DEFAULT_OTHER_SERVICES_PANEL_POSITION = 4

const STORAGE_KEY = "debugOtherServicesPanelPosition"

// null resets it to the default
export type SetOtherServicesPanelPosition = (position: number | null) => void

export function parseOtherServicesPanelPosition(
    value: string | null | undefined,
): number | null {
    if (!value || !/^\d+$/.test(value.trim())) {
        return null
    }
    return Number(value.trim())
}

/*
 * The number of results in the first page after which an extra other services
 * panel is shown (0 for none). In debug mode it can be overridden, and the
 * override is saved in storage so it survives reloads.
 * See docs/other-services-panel.md § "Changing where the panel appears in debug mode"
 */
export default function useOtherServicesPanelPosition(
): [number, SetOtherServicesPanelPosition] {
    const [debugMode] = useDebugModeContext()
    const [override, setOverride] = useState<number | null>(null)

    // Read from storage after the first render so the client's first render
    // matches the server's (like debug mode itself)
    useEffect(() => {
        setOverride(parseOtherServicesPanelPosition(Storage.getItem(STORAGE_KEY)))
    }, [])

    const setPosition: SetOtherServicesPanelPosition = position => {
        if (position === null) {
            Storage.removeItem(STORAGE_KEY)
        } else {
            Storage.setItem(STORAGE_KEY, position, false)
        }
        setOverride(position)
    }

    const position = debugMode && override !== null ?
        override
        : DEFAULT_OTHER_SERVICES_PANEL_POSITION

    return [position, setPosition]
}
