import {useState, useEffect, useRef, RefObject} from "react";

export default (): [(ref: RefObject<HTMLElement>) => void, () => void] => {
    const [prevFocus, setPrevFocus] = useState<HTMLElement | null>(null)
    // required to solve react closure issue
    // stackoverflow.com/questions/62806541/
    // how-to-solve-the-react-hook-closure-issue
    const prevFocusRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        prevFocusRef.current = prevFocus
    }, [prevFocus])

    const focusElement = (ref: RefObject<HTMLElement>) => {
        setPrevFocus(document.activeElement as HTMLElement)
        ref?.current?.focus()
    }

    const revertFocus = () => {
        prevFocusRef.current?.focus()
    }

    return [focusElement, revertFocus]
};

