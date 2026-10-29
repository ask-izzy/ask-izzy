import React, {useState, useRef} from "react"

type Props = {
    rerenderAfterMount?: boolean
}

function useIsMounted(props: {rerenderAfterMount: true}): boolean;
function useIsMounted(props?: {rerenderAfterMount?: false}): React.MutableRefObject<boolean>;

function useIsMounted({rerenderAfterMount}: Props = {}): React.MutableRefObject<boolean> | boolean {
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
