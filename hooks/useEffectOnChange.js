/* @flow */
import {useEffect, useRef} from "react"

const useOnChange: typeof useEffect = (effect, deps) => {
    const isInitialMount = useRef(true);

    useEffect((...args) => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            return effect(...args)
        }
    }, deps);
}

export default useOnChange
