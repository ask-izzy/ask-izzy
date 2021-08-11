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

    let search = (params):string => (
        params.search && `Search "${titleize(params.search)}"`
    );

    const pageType = (): string => (
        routeType && routeType.length >= 2 ? routeType.join(" ") : ""
    )

    const pageTitle = (page) => {
        let title = page.replace(/-/g, " ")
        return CATEGORY_TITLES_MAPPING[page] ||
        title.charAt(0).toUpperCase() + title.slice(1)
    };

    const formatQuestionFlowTitles = (
        page: string,
        subPage: string,
    ): string => {
        const question = QUESTION_TITLE_FORMAT_MAPPING[subPage] ||
            pageTitle(subPage);

        title = `${page} ${question ? `(${question})` : ""}`

        // When viewing your answers or editing an answer
        if (pageType().includes("Edit")) {
            title += " - [selected answers]"
        }
        return title;
    }

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

    if (pageType() !== "" &&
        !pageType().includes("Static") &&
        !pageType().includes("Results")
    ) {
        const page = (params.page && pageTitle(params.page)) || search(params);

        // If a route has subPage (e.g. question) it will set that
        // otherwise it will assume it's an Intro Page
        // There is a case when viewing your answers
        // when there's no subPage that it should be blank
        const subPage = params?.subpage ||
            (!pageType().includes("Edit") ? "Intro" : "");

        title = formatQuestionFlowTitles(page, subPage);
    }

    return title ? `${title} | Ask Izzy` : "Ask Izzy";
}

export default {
    resetDfvOptions,
    makeTitle,
}
