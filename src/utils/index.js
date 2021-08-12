/* @flow */
import storage from "../storage";

import AreYouSafe from "../pages/personalisation/AreYouSafe";
import OnlineSafetyScreen from "../pages/personalisation/OnlineSafetyScreen";
import {titleize} from "underscore.string";

const QUESTION_TITLE_FORMAT_MAPPING: {[string]: string} = {
    "dfv-demographics": "Personal",
    "demographics": "Personal",
    "service-list": "Services",
    "sub-health": "Health",
    "sub-legal": "Legal",
    "sub-food": "Services",
    "sub-advocacy": "Services",
    "sub-everyday-things": "Services",
    "sub-addiction": "Drugs & alcohol",
    "sub-money": "Money services",
    "sub-counselling": "Counselling services",
    "sub-life-skills": "Life skills",
    "sub-indigenous": "Indigenous",
    "sub-job": "Jobs",
    "are-you-safe": "Are you safe",
    "online-safety-screen": "Help",
    "lgbtiqa-domestic-violence": "LGBTIQA+ help",
    "under-18-dfv": "Under 18 help",
}

const CATEGORY_TITLES_MAPPING: {[string]: string} = {
    "life-skills-education": "Life skills & education",
    "domestic-family-violence-help": "Domestic & family violence help",
    "support-counselling": "Support & counselling",
    "drugs-alcohol": "Drugs & alcohol",
}

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

/**
 * Strips the all the '-' and sets the first letter to an upperCase
 * It will check to see if the text matches any special cases in
 * CATEGORY_TITLES_MAPPING first before formatting
 * @param text - The text to be formatted
 * @return {string} - Returns the formatted string
 */
const formatPageTitle = (text) => {
    let title = text && text.replace(/-/g, " ") || ""
    return CATEGORY_TITLES_MAPPING[text] ||
    title.charAt(0).toUpperCase() + title.slice(1) || ""
};

export const makeTitle = (
    title: string,
    params: {[string]: string},
): string => {

    const getSearchText = (): string => (
        params.search && `Search "${titleize(params.search)}"`
    );

    // Calculates current route subPage
    // Checks to see If the page is not in the question summary flow
    // otherwise it will return Intro or fallback to ""
    const getRouteSubPage = () => (
        params?.subpage || !title.includes("Edit") && params?.page && "intro" ||
        ""
    );

    // Sets the pageTitle and the routeSubPage
    const pageTitle = getSearchText() || params?.page || title;
    let routeSubpage = getRouteSubPage();

    // Formats the subpage
    if (routeSubpage) {
        routeSubpage = `(${
            QUESTION_TITLE_FORMAT_MAPPING[routeSubpage] ||
            formatPageTitle(routeSubpage)
        })`;
    }

    // Returns the title for the search results page
    if (title.includes("Results")) {
        return `${title === "Results map" ? "Map of" : ""}
         ${formatPageTitle(pageTitle)} in ${params?.suburb},
         ${params?.state} | Ask Izzy`;
    }

    // Append selected answers to the question summary flow
    if (title.includes("Edit")) {
        routeSubpage += " - [selected answers]";
    }

    if (!title) {
        return "Ask Izzy"
    } else {
        return `${formatPageTitle(pageTitle)} ${routeSubpage} | Ask Izzy`
    }

}

export default {
    resetDfvOptions,
    makeTitle,
}
