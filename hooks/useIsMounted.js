/* @flow */
import React, {useState} from "react"

export default (): boolean => {
    const [isMounted, setIsMounted] = useState(false)

    React.useEffect(() => setIsMounted(true), [])

    return isMounted
}
