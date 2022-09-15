/* @flow */
import {useState, useEffect, useRef} from "react";

type refType = { current: null | HTMLElement | typeof undefined} | null

export default (): [(refType) => void, () => void] => {
    const [prevFocus, setPrevFocus] = useState<HTMLElement | null>(null)
    const prevFocusRef = useRef()

    useEffect(() => {
        // required to solve react closure issue
        // stackoverflow.com/questions/62806541/how-to-solve-the-react-hook-closure-issue
        prevFocusRef.current = prevFocus
    }, [prevFocus])

    const focusElement = (ref: refType) => {
        setPrevFocus(document.activeElement)
        ref?.current?.focus()
    }

    const revertFocus = () => {
        prevFocusRef.current?.focus()
    }

    return [focusElement, revertFocus]
};

