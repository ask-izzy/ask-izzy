/* @flow */
import {useState, useEffect, useRef} from "react";

type refType = { current: null | HTMLElement | typeof undefined} | null


export default (): [(refType) => void, () => void, () => void] => {
    const [prevFocus, setPrevFocus] = useState<HTMLElement | null>(null)
    // required to solve react closure issue
    // stackoverflow.com/questions/62806541/
    // how-to-solve-the-react-hook-closure-issue
    const prevFocusRef = useRef()

    useEffect(() => {
        prevFocusRef.current = prevFocus
    }, [prevFocus])

    const focusElement = (ref: refType) => {
        setPrevFocus(document.activeElement)
        ref?.current?.focus()
    }

    const revertFocus = () => {
        prevFocusRef.current?.focus()
    }

    function skipLastTab(event: any) {
        // accessibility work around if Element is the last element in the document
        const focusableElements = document.querySelectorAll(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
        );
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        if (
            event.code === "Tab" &&
        document.activeElement === lastFocusableElement
        ) {
            revertFocus();
            event.preventDefault();
            event.stopPropagation();
        }
    }

    return [focusElement, revertFocus, skipLastTab]
};

