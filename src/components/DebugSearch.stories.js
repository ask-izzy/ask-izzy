/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import DebugSearch from "./DebugSearch";
import storage from "../storage";
import { getCategory } from "../constants/categories";

export default {
    title: "App Components/Debug/DebugSearch",
    component: DebugSearch,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DebugSearch {...args} />;
};

export const HousingSearch: typeof Template = Template.bind({});
HousingSearch.args = {
    search: getCategorySearchQuery("housing", {
        location: "Richmond, VIC",
        "sleep-tonight": "Yes",
        gender: "Female",
        age: "27 to 39",
        demographics: ["Couples", "Have pets"],
    }),
};

function getCategorySearchQuery(categoryKey, questionAnswers) {
    const category = getCategory(categoryKey)
    if (!category) {
        throw new Error(`Category "${categoryKey}" does not exist`)
    }
    setAnswers(questionAnswers)
    const searchQuery = buildSearchQuery(
        category.search,
        category.personalisation
    )
    clearAnswers(questionAnswers)
    return searchQuery
}

function buildSearchQuery(initialSearchQuery, personalisations) {
    let searchQuery = JSON.parse(JSON.stringify(initialSearchQuery));

    for (let personalisation of personalisations) {
        if (
            typeof personalisation.getShouldIncludePage === "function" &&
            !personalisation.getShouldIncludePage()
        ) {
            continue
        }

        if (typeof personalisation.getSearch === "function") {
            searchQuery = personalisation.getSearch(searchQuery);

            if (!searchQuery) {
                return null;
            }
        }
    }

    return searchQuery
}


function setAnswers(answers) {
    for (const [key, answer] of Object.entries(answers)) {
        const stringifiedAnswer = typeof answer === "string" ?
            answer
            : JSON.stringify(answer) || ""
        storage.setItem(key, stringifiedAnswer)
    }
}

function clearAnswers(answers) {
    for (const key of Object.keys(answers)) {
        storage.removeItem(key)
    }
}
