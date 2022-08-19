/* @flow */
import {useState} from "react";

type refType = { current: null | HTMLElement | typeof undefined} | null

export default (newFocusRef: refType): Array<function> => {
    const [prevFocus, setPrevFocus] = useState<function>(null)
    const focusElement = () => {
        setPrevFocus(document.activeElement)
        newFocusRef?.current?.focus()
    }
    const revertFocus = () => {
        prevFocus?.focus()
    }
    return [focusElement, revertFocus]
};

