/* @flow */
import React, {useEffect} from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"
import { useA11yDialog } from "react-a11y-dialog"
import ReactDOM from "react-dom"

import isMounted from "@/hooks/useIsMounted"
import useUniqueId from "@/hooks/useUniqueId"

type Props = {
    children: ({
        titleProps: {[string]: any}
    }) => ReactNode,
    className?: string,
    open: boolean,
    onClose: () => void
}

export default function Dialog(
    {className, open, children, onClose, ...rest}: Props
): ReactNode {
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

    if (!isMounted()) {
        return null
    }

    return ReactDOM.createPortal(
        <div
            {...attr.container}
            className={cnx("Dialog", className)}
        >
            <div
                {...attr.overlay}
                className="overlay"
            />

            <div
                {...attr.dialog}
                className="content"
            >
                {children && children({titleProps: attr.title})}
            </div>
        </div>,
        document.body
    )
}
