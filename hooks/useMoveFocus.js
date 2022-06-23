/* @flow */
import {useState, useEffect} from "react";
import type {Node as ReactNode} from "react"

let firstLoadHasOccurred = false
let lastVisitedPage

type refType = { current: null | HTMLElement | typeof undefined} | null

export default (newFocusRef: refType): Array<function> => {
    const [prevFocus, setPrevFocus] = useState<function>(null)
    const [newFocus, setNewFocus] = useState<refType>(newFocusRef)
    const focusElement = () => {
        setPrevFocus(document.activeElement)
        if(newFocus?.current) {
            newFocus.current?.focus()
        }
    }
    const revertFocus = () => {
        prevFocus?.focus()
    }
    return [focusElement, revertFocus]
};

