import {useState, useEffect, useRef} from "react";

type refType = { current: null | HTMLElement | typeof undefined} | null


export default (): [(arg0: refType) => void, () => void, () => void] => {
    const [prevFocus, setPrevFocus] = useState<HTMLElement | null>(null)
    // required to solve react closure issue
    // stackoverflow.com/questions/62806541/
    // how-to-solve-the-react-hook-closure-issue
    const prevFocusRef = useRef()

    useEffect(() => {
        // @ts-expect-error TODO(ts-migration): Type 'HTMLElement' is not assignable to type 'undefined'.
        prevFocusRef.current = prevFocus
    }, [prevFocus])

    const focusElement = (ref: refType) => {
        // @ts-expect-error TODO(ts-migration): Argument of type 'Element' is not assignable to parameter of type 'SetS…
        setPrevFocus(document.activeElement)
        ref?.current?.focus()
    }

    const revertFocus = () => {
        // @ts-expect-error TODO(ts-migration): 'prevFocusRef.current' is possibly 'undefined'.
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

    // @ts-expect-error TODO(ts-migration): Type '(event: any) => void' is not assignable to type '() => void'.
    return [focusElement, revertFocus, skipLastTab]
};

