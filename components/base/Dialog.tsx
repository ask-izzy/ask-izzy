import React, {useEffect, ReactNode} from "react"
import cnx from "classnames"
import { useA11yDialog } from "react-a11y-dialog"
import ReactDOM from "react-dom"

import isMounted from "@/hooks/useIsMounted"
import useUniqueId from "@/hooks/useUniqueId"

type Props = {
    children: (props: {titleProps: Record<string, any>}) => ReactNode,
    className?: string,
    open: boolean,
    onClose: () => void
}

export default function Dialog({
    className,
    open,
    children,
    onClose,
}: Props) {
    const [instance, attr] = useA11yDialog({
        id: `dialog-${useUniqueId()}`,
    } as any)

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
            instance.on("hide", () => {
                onClose()
            })
        }
    }, [instance])

    if (!isMounted()) {
        return null
    }

    return ReactDOM.createPortal(
        <div
            {...attr.container as any}
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
        document.body,
    )
}
