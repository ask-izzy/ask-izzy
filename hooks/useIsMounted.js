/* @flow */
import React, {useState, useRef} from "react"

type Props = {
    rerenderAfterMount?: boolean
}

declare function useIsMounted(props: {rerenderAfterMount: true}): boolean
declare function useIsMounted(props?: {rerenderAfterMount?: false}): $Call<typeof useRef, boolean>

function useIsMounted({rerenderAfterMount}: Props = {}): $Call<typeof useRef, boolean> | boolean {
    const isMountedRef = useRef(false);
    const [isMountedState, setIsMountedState] = useState(false)

    React.useEffect(() => {
        if (rerenderAfterMount) {
            setIsMountedState(true)
        } else {
            isMountedRef.current = true
        }
    }, [])

    return rerenderAfterMount ? isMountedState : isMountedRef
}

export default useIsMounted
