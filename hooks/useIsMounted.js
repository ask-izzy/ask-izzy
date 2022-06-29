import React, {useState} from "react"

export default () => {
    const [isMounted, setIsMounted] = useState(false)

    React.useEffect(() => setIsMounted(true), [])

    return isMounted
}
