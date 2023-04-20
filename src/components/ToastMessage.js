/* @flow */

import React, {useEffect, useState, useRef} from "react";
import type {Node as ReactNode} from "react"
import Button from "@/src/components/base/Button";
import Snackbar from "@mui/material/Snackbar";
import Cross from "@/src/icons/Cross"
import useMoveFocus from "@/hooks/useMoveFocus";
import useToastMessage from "@/hooks/useToastMessage";


export default function ToastMessage(): ReactNode {
    const autoHideDuration = 8000
    const [focusTimer, setFocusTimer] = useState()
    const actionDescriptorRef = useRef(null)
    const closeButtonRef = useRef(null)
    const snackBarRef = useRef()
    const [setFocus, revertFocus, skipLastTab] = useMoveFocus()

    const {
        open,
        setOpen,
        message,
        actionDescriptor,
        onActionDescriptorClick,
        forceToastMessageUpdateState,
    } = useToastMessage()

    useEffect(() => {
        // toast message stops autoclose-timer
        // after losing focus, so manual timeout is necessary
        if (open) {
            clearTimeout(focusTimer)
            const hasActionDescriptor = actionDescriptorRef.current && (
                window.getComputedStyle(actionDescriptorRef.current).getPropertyValue("display") != "none"
            )
            const refToFocus = hasActionDescriptor ? actionDescriptorRef : closeButtonRef
            setFocus(refToFocus)
            setFocusTimer(setTimeout(
                () => setOpen(false), autoHideDuration
            ))
        } else {
            clearTimeout(focusTimer)
        }
    }, [open, forceToastMessageUpdateState])

    useEffect(() => {
        // accessibility work around if toast bar is the last element in the document
        if (open) {
            snackBarRef.current?.addEventListener("keydown", skipLastTab)
        } else {
            snackBarRef.current?.removeEventListener("keydown", skipLastTab)
        }
    }, [open])

    function onActionClick(): void {
        onActionDescriptorClick()
        revertFocus()
    }

    const action = (
        <div className="action-container">
            {
                actionDescriptor &&
                <Button
                    className="action-description-button"
                    ref={actionDescriptorRef}
                    onClick={onActionClick}
                >
                    {actionDescriptor}
                </Button>
            }
            <Button
                className="close-toast-message-button"
                ref={closeButtonRef}
                aria-label="Dismiss toast message"
                onClick={() => setOpen(false)}
                onBlur={() => revertFocus()}
            >
                <Cross/>
            </Button>
        </div>
    );


    return (
        <div className="ToastMessage">
            <Snackbar
                open={open}
                ref={snackBarRef}
                aria-label="Please read this"
                message={message}
                action={action}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                key={"bottomcenter"}
                sx={{
                    "& .MuiPaper-elevation": {
                        minWidth: {xs: "auto", sm: 350, md: 350, lg: 350, xl: 350},
                        backgroundColor: "var(--colour-brand-primary)",
                        color: "var(--raw-colour-warm-white)",
                        fontWeight: "lighter",
                        "& .MuiSnackbarContent-action": {
                            paddingLeft: "11px",
                        },
                    },
                }}
            />
        </div>
    );
}
