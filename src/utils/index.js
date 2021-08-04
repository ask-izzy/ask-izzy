/* @flow */
import storage from "../storage";

import AreYouSafe from "../pages/personalisation/AreYouSafe";
import OnlineSafetyScreen from "../pages/personalisation/OnlineSafetyScreen";
import {titleize} from "underscore.string";

const QUESTION_TITLE_FORMAT_MAPPING = {
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

const CATEGORY_TITLES_MAPPING = {
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

export const makeTitle = (
    route: string,
    params: Object,
    routeType?: Array<string>,
): string => {
    let title = route || "";

    Object.keys(params).forEach((key) => {
        // FIXME This is a hack. Rewrite it when we're not about to launch.
        if (key === "search") {
            title = title.replace(":page", pageTitle(params[key]));
        }
        if (key !== "serviceName") {
            title = title.replace(`:${key}`, pageTitle(params[key]));
        }
    });

    title = pageTitle(title
        .replace(" in :suburb, :state", "")
        .replace(/:[^\s]+/, ""));

    if (routeType && routeType.length === 2 &&
        !routeType.join(" ").includes("Results")) {
        title = getCorrectTitle(title, params, routeType.join(" "))
    }

    return title ? `${title} | Ask Izzy` : "Ask Izzy";
}

const pageTitle = (page) => {
    let title = page.replace(/-/g, " ")
    return CATEGORY_TITLES_MAPPING[page] ||
    title.charAt(0).toUpperCase() + title.slice(1)
};

const getCorrectTitle = (
    title: string,
    params: Object,
    routeType: string
) => {

    let search = (params) => (
        params.search && `Search "${titleize(params.search)}"`
    );

    const page = (params.page && pageTitle(params.page)) || search(params)

    if (routeType.includes("Edit")) {
        title = questionFlowTitle(page, params?.subpage) +
            " - [selected answers]"
    } else {
        title = questionFlowTitle(page, params?.subpage || "Intro")
    }
    return title
}

const questionFlowTitle = (title: string, subpage?: string): string => {
    const question = subpage && (QUESTION_TITLE_FORMAT_MAPPING[subpage] ||
        pageTitle(subpage));
    return `${title} ${question ? `(${question})` : ""}`
}

export default {
    resetDfvOptions,
    makeTitle,
}
