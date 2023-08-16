/* @flow */
// useEffect will call the callback after the first render and then after every time
// a dependency changes. useEffectOnChange won't call the call back after first render
// but it will after each time a dependency changes.
import {useEffect, useRef} from "react"

const useEffectOnChange: typeof useEffect = (effect, deps) => {
    const isFirstCall = useRef(true);

    useEffect((...args) => {
        if (isFirstCall.current) {
            isFirstCall.current = false;
        } else {
            return effect(...args)
        }
    }, deps);
}

export default useEffectOnChange
