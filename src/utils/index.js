/* @flow */
import storage from "../storage";

import AreYouSafe from "../pages/personalisation/AreYouSafe";
import OnlineSafetyScreen from "../pages/personalisation/OnlineSafetyScreen";
import {titleize} from "underscore.string";
import {getCategory} from "../constants/categories";

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

    const location = storage.getLocation()
    const state = location.split(",").pop().trim()
    return states.includes(state) ? state : ""
}

export const resetDfvOptions = (): void => {
    if (Boolean(AreYouSafe.answer) &&
        [
            "No",
            "I'm not sure",
        ].indexOf(AreYouSafe.answer) > -1 &&
        !OnlineSafetyScreen.answer) {
        storage.removeItem(AreYouSafe.defaultProps.name);
    }
}

// eslint-disable-next-line complexity
export const makeTitle = (
    title?: string,
    params: {[string]: string},
    pageType: Array<string>,
): string => {

    const pageTitleArr = [];

    const category = getCategory(params.page)

    if (pageType && pageType[1] === "Results Map") {
        pageTitleArr.push("Map of");
    }

    if (params?.search) {
        pageTitleArr.push(`Search "${titleize(params.search)}"`);
    } else if (category?.name) {
        pageTitleArr.push(category.name);
    } else if (title) {
        pageTitleArr.push(title);
    }

    if (
        pageType && pageType[1]?.includes("Personalisation") &&
        !pageType[1]?.includes("Edit")
    ) {
        const personalisation = category?.personalisation.find(
            cat => cat.defaultProps.name === params.subpage
        )
        if (personalisation) {
            pageTitleArr.push(`(${personalisation.title})`);
        } else {
            if (params.subpage === OnlineSafetyScreen.defaultProps.name) {
                pageTitleArr.push(`(${OnlineSafetyScreen.title})`)
            } else if (params.subpage === AreYouSafe.defaultProps.name) {
                pageTitleArr.push(`(${AreYouSafe.title})`)
            } else {
                pageTitleArr.push("(Intro)")
            }
        }
    }

    if (pageType && pageType[1]?.includes("Edit")) {
        pageTitleArr.push(" - [selected answers]");
    }

    // Returns the title for the search results page
    if (pageType && pageType[1]?.includes("Results")) {
        pageTitleArr.push(`in ${params?.suburb}, ${params?.state}`)
    }

    if (!pageTitleArr.length) {
        return "Ask Izzy"
    } else {
        return pageTitleArr.join(" ") + " | Ask Izzy"
    }
}

export default {
    resetDfvOptions,
    makeTitle,
}
