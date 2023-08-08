/* @flow */
import {useEffect, useRef, useState} from "react";
import { useRouter } from "next/router";

export default function useOnPageInitialRender(callback: () => void): void {
    const router = useRouter();

    const initialLoad = useRef(true)
    // In some cases there won't be a render following a routeChangeComplete event (such as navigating from two routes
    // with the same page component and props). So we update a state variable to ensure one defiantly occurs.
    const [, setForceRerender] = useState(false)

    useEffect(() => {
        const routeChangeCompleteHandler = () => {
            initialLoad.current = true
            setForceRerender(val => !val)
        }
        router.events.on("routeChangeComplete", routeChangeCompleteHandler)
        return () => router.events.off("routeChangeComplete", routeChangeCompleteHandler)
    }, [])

    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false;
            callback()
        }
    })

}

