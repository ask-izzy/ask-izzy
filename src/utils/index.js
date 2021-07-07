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
    "sub-addiction": "Drugs & Alcohol",
    "sub-life-skills": "Life Skills",
    "sub-indigenous": "Indigenous",
    "sub-job": "Jobs",
    "online-safety-screen": "Help",
    "lgbtiqa-domestic-violence": "LGBTIQA+ Help",
    "under-18-dfv": "Under 18 Help",
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
    comp: ?string
): string => {
    let unslug = (str) =>
        str.replace("-", " ").split(" ").map(titleize).join(" ");

    let title = route || "";

    Object.keys(params).forEach((key) => {
        // FIXME This is a hack. Rewrite it when we're not about to launch.
        if (key === "search") {
            title = title.replace(":page", unslug(params[key]));
        }
        title = title.replace(`:${key}`, unslug(params[key]));
    });

    title = title.replace(" in :suburb, :state", "").replace(/:[^\s]+/, "");

    if (Object.keys(params).length) {
        if (params.subpage) {
            title = questionFlowTitle(
                params.page || params.search,
                params.subpage,
            );
        } else if (!params.subpage && comp === "PersonalisationWizardPage") {
            title = questionFlowTitle(params.page || params.search,
                "Intro",
            );
        }
    }

    return title ? `${title} | Ask Izzy` : "Ask Izzy";
}

const questionFlowTitle = (title: string, subpage: string): string => {
    const question = QUESTION_TITLE_FORMAT_MAPPING[subpage] ||
        subpage.replace("-", " ")
    return titleize(title) + ` (${
        titleize(question.replace("-", " "))
    })`
}

export default {
    resetDfvOptions,
    makeTitle,
}
