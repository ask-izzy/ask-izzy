import {useState, useEffect} from "react"

/*
 * We want to avoid doing any dynamic things until after the initial render so
 * as the SSG content will match the CSG content.
 */
export default function usePostInitialRender(): boolean {
    const [postInitialRender, setPostInitialRender] = useState(false)

    useEffect(
        () => {
            if (!postInitialRender) {
                setPostInitialRender(true)
            }
        },
        [],
    )

    return postInitialRender
}
