/* @flow */
import storage from "../storage";

import {titleize} from "underscore.string";
import {getCategory} from "../constants/categories";
import Storage from "../storage";
import {
    getCurrentPersonalisationPage,
    currentRouteIsPersonalised,
} from "../utils/routing"
import type { RouterContextObject } from "../contexts/router-context";

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
    const state = location.split(",").pop().trim()
    return states.includes(state) ? state : ""
}

// eslint-disable-next-line complexity
export const makeTitle = (
    title: string,
    router: $PropertyType<RouterContextObject, 'router'>
): string => {
    const {match: {params, props: {type: pageType}}} = router

    const pageTitleArr = [];

    const category = getCategory(params.page)

    if (pageType?.[1] === "Results Map") {
        pageTitleArr.push("Map of");
    }

    if (params?.search) {
        pageTitleArr.push(`Search "${titleize(params.search)}"`);
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
            if (Storage.getSearchArea()) {
                pageTitleArr.push(`in ${Storage.getSearchArea()}`)
            }
        } else {
            pageTitleArr.push(`in ${params?.suburb}, ${params?.state}`)
        }
    }

    if (pageTitleArr.length) {
        return pageTitleArr.join(" ") + " | Ask Izzy"
    } else {
        return "Ask Izzy"
    }
}

export default {
    makeTitle,
}
