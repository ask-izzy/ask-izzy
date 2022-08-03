/* @flow */

import React, {useEffect, useState, useRef} from "react";
import type {Node as ReactNode} from "react"
import Button from "@/src/components/base/Button";
import Snackbar from "@mui/material/Snackbar";
import Cross from "@/src/icons/Cross"
import useMoveFocus from "@/hooks/useMoveFocus";


type Props = {
  open?: boolean,
  onClick?: function,
  message?: string,
  hasActionButton: boolean,
  actionDescriptor?: ReactNode,
}

export default function ToastMessage({
    open = false,
    onClick = () => {},
    message = "",
    hasActionButton,
    actionDescriptor = <></>,
}: Props): ReactNode {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [focusTimer, setFocusTimer] = useState();
    const toastMessageRef = useRef()
    const [setFocus, revertFocus] = useMoveFocus(toastMessageRef)
    const autoHideDuration = 8000

    useEffect(() => {
        if (open) {
            setIsOpen(true)
            clearTimeout(focusTimer)
            setFocus()
            // toast message stops autoclose-timer
            // after losing focus, so timeout is necessary
            setFocusTimer(setTimeout(
                () => setIsOpen(false), autoHideDuration
            ))
        }
    }, [open])

    useEffect(() => {
        // used for accessibility
        if (isOpen) {
            setFocus()
        } else {
            revertFocus()
            clearTimeout(focusTimer)
        }
    }, [isOpen])

    function handleAction(event, reason) {
        setIsOpen(false)
        onClick()
    }

    const action = (
        <>
            {
                <div className="action-container">
                    {
                        hasActionButton &&
                        <Button
                            className="try"
                            ref={toastMessageRef}
                            onClick={handleAction}
                        >
                            {actionDescriptor}
                        </Button>
                    }
                    <Button
                        className="try"
                        onClick={() => {
                            setIsOpen(false)
                        }}
                        onBlur={revertFocus}
                    >
                        <Cross />
                    </Button>
                </div>
            }
        </>
    );


    return (
        <div className="ToastMessage">
            <Snackbar
                open={isOpen}
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
