import {useEffect} from "react";
import { useRouter } from "next/router";

import * as gtm from "@/src/google-tag-manager";
import type {PageInfo} from "@/pages/_app"
import {
    getCategory,
} from "@/src/constants/categories"

export default (pageInfo: PageInfo): void => {
    const router = useRouter();

    useEffect(() => {
        router.events.on("routeChangeComplete", (path) => {
            const url = new URL(path, location.origin)

            const firstPathSegment = url.pathname.split("/")[1]
            const category = getCategory(firstPathSegment)

            recordAnalytics(url, {
                category,
                pageTitle: pageInfo.title,
                pageType: pageInfo.type,
            });
        });
    }, []);
};

function recordAnalytics(url, pageVars) {
    gtm.setPersistentVars(Object.keys(pageVars));

    // Since Ask Izzy is a SPA we need to manually register each
    // new page view
    gtm.emit({
        event: "Page Loaded",
        path: url.pathname + url.search,
        hash: url.hash,
        ...pageVars,
    });
}
