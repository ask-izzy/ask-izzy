import {useRef} from "react"

let idCounter = 1

export default (): number => {
    const idRef = useRef<number>()
    if (!idRef.current) {
        idRef.current = idCounter++;
    }

    return idRef.current
}
