import type {NextRouter} from "next/router"
import {titleize} from "underscore.string";

import storage from "@/src/storage";
import {
    getCurrentPersonalisationPage,
    currentRouteIsPersonalised,
    getCategoryFromRouter,
} from "@/src/utils/routing"

export function stateFromLocation(): string {
    const states = [
        "ACT",
        "NSW",
        "NT",
        "QLD",
        "SA",
        "TAS",
        "VIC",
        "WA",
    ];

    const location = storage.getSearchArea()
    const state = (location.split(",").pop() as string).trim()
    return states.includes(state) ? state : ""
}

// eslint-disable-next-line complexity
export const getFullPageTitle = (
    title: string,
    router: NextRouter,
    pageType?: Array<string>,
): string => {
    const params = router.query

    const pageTitleArr: Array<string> = [];

    const category = getCategoryFromRouter(router)

    if (pageType?.[1] === "Results Map") {
        pageTitleArr.push("Map of");
    }

    if (params?.search) {
        pageTitleArr.push(
            `Search "${titleize(decodeURIComponent(params.search as string))}"`,
        );
    } else if (category?.name) {
        pageTitleArr.push(category.name);
    } else if (title) {
        pageTitleArr.push(title);
    }

    if (currentRouteIsPersonalised(router)) {
        const personalisationPage = getCurrentPersonalisationPage(router);

        if (personalisationPage?.title) {
            pageTitleArr.push(`(${personalisationPage?.title})`)
        }
    }

    // If the current page is either the question summary page
    // or part of that navigation flow (editing answers)
    if (pageType?.[1]?.includes("Edit")) {
        pageTitleArr.push("- [selected answers]");
    }

    // Returns the title for the search results page
    if (pageType?.[1]?.includes("Results")) {
        // When going the results back from a previously view category
        // (without answering the questions again) the params of
        // the location don't get set. So we need to fetch the location
        // from storage
        if (!params.suburb && !params.state) {
            // If the location isn't set then it will not add
            // the 'in' location string to the title
            if (storage.getSearchArea()) {
                pageTitleArr.push(`in ${storage.getSearchArea()}`)
            }
        } else {
            pageTitleArr.push(
                `in ${decodeURIComponent(params?.suburb as string)}, ${decodeURIComponent(params?.state as string)}`,
            )
        }
    }

    if (pageTitleArr.length) {
        return pageTitleArr.join(" ") + " | Ask Izzy"
    } else {
        return "Ask Izzy"
    }
}

export default {
    getFullPageTitle,
}
