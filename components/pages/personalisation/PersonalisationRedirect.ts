import {useEffect} from "react"
import {useRouter} from "next/router"

import {
    goToPersonalisationNextPath,
} from "@/src/utils/routing"

export default function PersonalisationRedirect() {
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            goToPersonalisationNextPath({router})
        }
    }, [router]);
    return null
}
