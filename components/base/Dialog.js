/* @flow */
import React, {useEffect} from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"
import { useA11yDialog } from "react-a11y-dialog"
import ReactDOM from "react-dom"

import useIsMounted from "@/hooks/useIsMounted"
import useUniqueId from "@/hooks/useUniqueId"

type Props = {
    children: ({
        customTitleProps: {[string]: any},
        closeDialog: () => void,
        bodyClassName: string,
    }) => ReactNode,
    className?: string,
    open: boolean,
    onClose: () => void,
    type?: "standard" | "unstyled",
    title?: string,
    showCloseButton?: boolean
}

export default function Dialog(
    {className, open, children, onClose, type = "standard", title, showCloseButton = true, ...rest}: Props
): ReactNode {
    const isMounted = useIsMounted({rerenderAfterMount: true})
    const [instance, attr] = useA11yDialog({
        id: `dialog-${useUniqueId()}`,
    })

    if (children && typeof children !== "function") {
        throw Error("Dialog children must be a single function")
    }

    useEffect(() => {
        if (instance) {
            if (open) {
                instance.show()
            } else {
                instance.hide()
            }
        }
    }, [open, instance])

    useEffect(() => {
        if (instance) {
            instance.on("hide", (element, event) => {
                onClose()
            })
        }
    }, [instance])

    if (!isMounted) {
        return null
    }

    return ReactDOM.createPortal(
        <div
            {...attr.container}
            className={cnx("Dialog", `type-${type}`, className)}
        >
            <div
                {...attr.overlay}
                className="overlay"
            />

            <div
                {...attr.dialog}
                className="content"
            >
                {(title || showCloseButton) && (
                    <header>
                        {title && <h1 {...attr.title}>{title}</h1>}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="close"
                                aria-label="Close dialog"
                            >
                                <span>&times;</span>
                            </button>
                        )}
                    </header>
                )}
                {children && children({
                    customTitleProps: attr.title,
                    closeDialog: onClose,
                    bodyClassName: "body",
                })}
            </div>
        </div>,
        document.body
    )
}
