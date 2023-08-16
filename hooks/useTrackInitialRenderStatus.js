/* @flow */

import { useEffect } from "react"
import { useRouter } from "next/router"

import useOnPageInitialRender from "./useOnInitialPageRender"

export default function useTrackInitialRenderStatus(): void {
    const router = useRouter()

    useOnPageInitialRender(() => {
        window.pageFinishedInitialRender = true
    })

    useEffect(() => {
        const onInitialRenderStart = () => {
            window.pageFinishedInitialRender = false
        }

        router.events.on("routeChangeStart", onInitialRenderStart)

        return () => {
            router.events.off("routeChangeStart", onInitialRenderStart)
        }
    }, [])
}