import {useRef} from "react"

let idCounter = 1

export default (): number => {
    const idRef = useRef()
    if (!idRef.current) {
        // @ts-expect-error TODO(ts-migration): Type 'number' is not assignable to type 'undefined'.
        idRef.current = idCounter++;
    }

    return idRef.current
}
