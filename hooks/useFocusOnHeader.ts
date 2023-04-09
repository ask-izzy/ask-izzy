import {useEffect} from "react";
import { useRouter } from "next/router";

import { waitTillPageLoaded } from "@/src/utils/page-loading.js"


let firstLoadHasOccurred = false
let lastVisitedPage

export default (): void => {
    const router = useRouter();

    useEffect(() => {
        if (router.asPath === lastVisitedPage) {
            return
        }
        if (firstLoadHasOccurred) {
            waitTillPageLoaded().then(() => {
                // I have no idea why the setTimeout is necessary here. If the heading exists
                // and we are able to focus on it then Voice Over should presumably be able
                // to read it's contents. But for some reason it doesn't unless we add a delay
                // here. Oh well thankfully it's not that ugly of a hack.
                setTimeout(
                    () => document.querySelector("h1")?.focus(),
                    100,
                )
            }).catch()
        } else {
            firstLoadHasOccurred = true
        }
        lastVisitedPage = router.asPath
    }, [router])
};

