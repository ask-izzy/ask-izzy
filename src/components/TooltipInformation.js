/* @flow */
import React, {useState, useRef, useEffect} from "react";
import type {Node as ReactNode} from "react"
import ClickAwayListener from "@mui/material/ClickAwayListener";

import Tooltip from "@/src/components/Tooltip";
import Button from "@/src/components/base/Button";
import Cross from "@/src/icons/Cross"
import useMoveFocus from "@/hooks/useMoveFocus";

type TooltipProps = {
    content?: ReactNode,
    children: ReactNode,
}
export default function TooltipInformation({
    content,
    children,
    ...otherProps
}: TooltipProps): ReactNode {
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
    const closeButtonRef = useRef<any>(null)
    const [setFocus, revertFocus, skipLastTab] = useMoveFocus();

    useEffect(() => {
        // accessibility work around if Tooltip is the last element in the document
        if (tooltipOpen) {
            const timeoutId = setTimeout(() => {
                setFocus(closeButtonRef)
                closeButtonRef.current?.addEventListener("keydown", skipLastTab)
            }, 100);
            return () => {
                clearTimeout(timeoutId);
            }
        } else {
            revertFocus()
            closeButtonRef.current?.removeEventListener("keydown", skipLastTab)
        }
    }, [tooltipOpen]);

    return (
        <div
            className="TooltipInformation Tooltip"
        >
            {
                /*
                    styling has to be done in css as accessing the
                    styles for the MUI tooltip component is too complicated in JS
                */
            }
            <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
                <Tooltip
                    content={
                        <div className="tooltip-content">
                            {content}
                            <Button
                                className="close-tooltip"
                                ref={closeButtonRef}
                                aria-label="Dismiss tooltip"
                                onClick={() => setTooltipOpen(false)}
                                onBlur={() => setTooltipOpen(false)}
                            >
                                <Cross/>
                            </Button>
                        </div>
                    }
                    open={tooltipOpen}
                    disableHoverListener={true}
                    disableTouchListener={true}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: "var(--colour-bg-standard)",
                                border: "1px solid var(--colour-border-list-item-gray)",
                                color: "var(--colour-text-dark)",
                                fontSize: "14px",
                                fontWeight: "325",
                                "& .MuiTooltip-arrow": {
                                    color: "var(--colour-border-list-item-gray)",
                                },
                            },
                        },
                    }}
                >
                    <Button
                        className="tooltip-children-container"
                        onClick={(event) => {
                            event.preventDefault();
                            setTooltipOpen(true);
                        }}
                    >
                        {children}
                    </Button>
                </Tooltip>
            </ClickAwayListener>
        </div>
    );
}


