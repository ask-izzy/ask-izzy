import React, {useEffect, useId, useState} from "react"
import type {ReactNode} from "react"

import DebugContainer from "@/src/components/DebugContainer"
import Button from "@/src/components/base/Button"
import {
    DEFAULT_OTHER_SERVICES_PANEL_POSITION,
    parseOtherServicesPanelPosition,
} from "@/hooks/useOtherServicesPanelPosition"
import type {SetOtherServicesPanelPosition} from
    "@/hooks/useOtherServicesPanelPosition"

type Props = {
    position: number,
    setPosition: SetOtherServicesPanelPosition,
}

/*
 * Lets testers choose where in the first page of results the extra other
 * services panel goes. Only shown in debug mode.
 * See docs/other-services-panel.md § "Changing where the panel appears in debug mode"
 */
export default function DebugOtherServicesPanelPosition({
    position,
    setPosition,
}: Props): ReactNode {
    const inputId = useId()
    const [value, setValue] = useState(String(position))

    useEffect(() => {
        if (parseOtherServicesPanelPosition(value) !== position) {
            setValue(String(position))
        }
    }, [position])

    function onChange(newValue: string): void {
        setValue(newValue)
        const parsed = parseOtherServicesPanelPosition(newValue)
        if (parsed !== null) {
            setPosition(parsed)
        }
    }

    return (
        <DebugContainer message="Debug other services panel">
            <div className="DebugOtherServicesPanelPosition">
                <label htmlFor={inputId}>
                    Also show the panel in the first page after result
                    (0 for none)
                </label>
                <input
                    id={inputId}
                    type="number"
                    min={0}
                    step={1}
                    value={value}
                    onChange={event => onChange(event.target.value)}
                />
                <Button onClick={() => setPosition(null)}>
                    Reset to default ({DEFAULT_OTHER_SERVICES_PANEL_POSITION})
                </Button>
            </div>
        </DebugContainer>
    )
}
