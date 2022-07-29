/* @flow */

import {useRef} from "react"

let idCounter = 1

export default (): number => {
    const idRef = useRef()
    if (!idRef.current) {
        idRef.current = idCounter++;
    }

    return idRef.current
}
