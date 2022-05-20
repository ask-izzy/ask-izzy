/* @flow */
import type {
    Node as ReactNode,
} from "react"
import _ from "underscore";

import {replaceUrlLocation} from "./url";
import Category from "../constants/Category";
import storage from "../storage";
import type { RouterContextObject } from "../contexts/router-context";
import type { SearchQueryChanges } from "../../src/iss/searchQueryBuilder";

import type {
    PersonalisationPage,
} from "../../flow/personalisation-page"


export function getFullPathForPersonalisationSubpath(
    router: $PropertyType<RouterContextObject, 'router'>,
    subpath: string
): string {
    // Rewrites the URL based on search location/personalisation
    const parts = decodeURIComponent(
        router.location.pathname
    ).split("/");
    const location = storage.getSearchArea();

    if (location) {
        replaceUrlLocation(location, parts)
    }

    // Replace everything after and including 'personalise'
    parts.splice(
        parts.indexOf("personalise"),
        parts.length,
        subpath
    )

    return parts.join("/");
}

export function navigateToPersonalisationSubpath(
    router: $PropertyType<RouterContextObject, 'router'>,
    subpath: string,
    navigateOptions?: {}
): void {
    router.navigate(
        getFullPathForPersonalisationSubpath(router, subpath),
        navigateOptions
    );
}

export function prettyPrintAnswer(
    personalisationPage: PersonalisationPage,
    answer: string
): ReactNode {
    if (personalisationPage.prettyPrintAnswer) {
        return personalisationPage.prettyPrintAnswer(answer)
    }
    return answer
}



export function getBannerName(
    category: ?Category,
    questionPageName?: string
): string {
    return (questionPageName === "sub-indigenous" && "atsi") ||
        category?.key ||
        "homepage"
}

export function setLocationFromUrl(
    router: $PropertyType<RouterContextObject, 'router'>
): void {
    // Update the URL to include the location, so that links
    // are SEO-friendly. If we dont have a location but the
    // URL does, use the one from the url.
    const {suburb, state} = router.match.params;

    if (suburb && state) {
        if (storage.getSearchArea() != `${suburb}, ${state}`) {
            // Use the location from the URL.
            storage.setSearchArea(`${suburb}, ${state}`);
            storage.clearUserGeolocation()
        }
    }
}

export function getSavedPersonalisationAnswer(
    personalisationPage: PersonalisationPage
): string | Array<string> {
    if (personalisationPage.multipleChoice) {
        let savedAnswer = storage.getJSON(personalisationPage.name);

        if (Array.isArray(savedAnswer)) {
            // Update answers if we had stored an old answer
            savedAnswer = savedAnswer.map((answer) =>
                personalisationPage.oldAnswers?.[answer] || answer
            )
            return _.union(
                personalisationPage.possibleAnswers.keys,
                savedAnswer
            );
        }

        return savedAnswer;

    } else {
        let answer = storage.getItem(personalisationPage.name);

        if (typeof answer !== "string") {
            return "";
        }

        return answer;
    }
}

export function getSearchQueryChanges(
    personalisationPage: PersonalisationPage
): SearchQueryChanges | Array<SearchQueryChanges> | null {
    if (personalisationPage.searchQueryChanges) {
        return personalisationPage.searchQueryChanges
    }
    const savedAnswer = getSavedPersonalisationAnswer(
        personalisationPage
    )
    if (personalisationPage.type !== "question") {
        return {}
    }
    const possibleAnswers = personalisationPage.possibleAnswers
    if (savedAnswer instanceof Array) {
        // If there are multiple answers, at most the first 2 as ordered
        // by the order they appear in the list displayed to the user
        const searchQueryChanges: Array<SearchQueryChanges> = []
        for (const [answer, queryChange] of (
            // We know queryChange must be SearchQueryChanges but because
            // flow is stupid it Object.entries() outputs [string, mixed]
            // no matter the input.
            (Object.entries(possibleAnswers): any): Array<
                [string, SearchQueryChanges]
            >
        )) {
            if (savedAnswer.includes(answer)) {
                searchQueryChanges.push(queryChange)
            }
            if (searchQueryChanges.length >= 2) {
                break;
            }
        }
        return searchQueryChanges
    } else if (savedAnswer === "(skipped)") {
        // This question has been skipped.
        return {};
    } else if (savedAnswer) {
        return possibleAnswers[savedAnswer] || null
    } else {
        // this question hasn't been answered
        return null;
    }
}
