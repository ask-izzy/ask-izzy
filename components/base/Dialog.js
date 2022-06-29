/* @flow */
import React, {useState, useEffect} from "react"
import type {Node as ReactNode} from "react"
import cnx from "classnames"
import { A11yDialog, useA11yDialog } from 'react-a11y-dialog'
import ReactDOM from 'react-dom'

import isMounted from "@/hooks/useIsMounted"

type Props = {
    children: ({
        close: () => void
    }) => ReactNode,
    className?: string,
    open: boolean,
    onClose: () => void
}

export default function Dialog(
    {className, open, children, onClose, ...rest}: Props
): ReactNode {

    const [instance, attr] = useA11yDialog({
        // The required HTML `id` attribute of the dialog element, internally used
        // a11y-dialog to manipulate the dialog.
        id: 'my-dialog',
        // The required dialog title, mandatory in the document
        // to provide context to assistive technology.
        title: 'My dialog',
    })

    console.log("----", children)

    if (children && typeof children !== "function") {
        throw Error("Dialog children must be a single function")
    }
    useEffect(() => {
        console.log("dialog change", open)
        if (instance) {
            if (open) {
                console.log("show")
                instance.show()
            } else {
                console.log("hide")
                instance.hide()
            }
        }
    }, [open, instance])

    useEffect(() => {
        console.log("set hide calback", instance)
        if (instance) {
            instance.on("hide", (element, event) => {
                console.log("hiddeeee")
                onClose()
            })
        }
    }, [instance])

    console.log("attr", attr)



    if (!isMounted()) {
        return null
    }


    const dialogd = ReactDOM.createPortal(
        <div {...attr.container} className='Dialog'>
            <div {...attr.overlay} className='overlay' />

            <div {...attr.dialog} className='content'>
                {children && children({close: attr.closeButton.onClick})}
            </div>
        </div>,
        document.body
    )
    return <div>cake{dialogd}</div>
}
