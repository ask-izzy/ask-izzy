import React, {useEffect, useState, useRef} from "react";
import Snackbar from "@mui/material/Snackbar";

import Button from "@/src/components/base/Button";
import Cross from "@/src/icons/Cross"
import useMoveFocus from "@/hooks/useMoveFocus";
import useToastMessage from "@/hooks/useToastMessage";


export default function ToastMessage() {
    const autoHideDuration = 8000
    const [focusTimer, setFocusTimer] = useState<any>()
    const ActionDescriptorRef = useRef(null)
    const closeButtonRef = useRef(null)
    const snackBarRef = useRef<HTMLElement>()
    const [setFocus, revertFocus] = useMoveFocus()

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
            const refToFocus = actionDescriptor ? ActionDescriptorRef : closeButtonRef
            setFocus(refToFocus)
            setFocusTimer(setTimeout(
                () => setOpen(false), autoHideDuration,
            ))
        } else {
            clearTimeout(focusTimer)
        }
    }, [open, forceToastMessageUpdateState])

    useEffect(() => {
        // accessibility work around if toast bar is the last element in the document
        function skipLastTab(event) {
            const focusableELements = document.querySelectorAll(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])",
            )
            const lastFocusableElement = focusableELements[focusableELements.length - 1]
            if (
                event.code === "Tab" &&
                document.activeElement === lastFocusableElement
            ) {
                revertFocus()
                event.preventDefault()
                event.stopPropagation()
            }
        }
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
                    ref={ActionDescriptorRef}
                    onClick={onActionClick}
                >
                    {actionDescriptor}
                </Button>
            }
            <Button
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
                        minWidth: "auto",
                        backgroundColor: "var(--colour-brand-primary)",
                        color: "var(--raw-colour-warm-white)",
                        fontWeight: "lighter",
                    },
                }}
            />
        </div>
    );
}
