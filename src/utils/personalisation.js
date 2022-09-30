/* @flow */
import type {
    Node as ReactNode,
} from "react"
import _ from "underscore";
import type { NextRouter } from "next/router"

import Category from "@/src/constants/Category";
import storage from "../storage";
import type { SearchQueryChanges } from "../../src/iss/searchQueryBuilder";
import type {
    PersonalisationPage,
} from "../../flow/personalisation-page"

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
    if (questionPageName === "sub-indigenous") {
        return "atsi"
    } else if (category?.key === "search") {
        return "homepage"
    } else if (category) {
        return category.key
    }
    return "homepage"
}

export function setLocationFromUrl(
    router: NextRouter
): void {
    if (!router.isReady) {
        console.error(
            "Trying to ready location from the URL before the router is ready"
        )
    }
    const {suburb, state} = router.query

    if (suburb && state) {
        const locationFromUrl = `${decodeURIComponent(suburb)}, ${decodeURIComponent(state)}`
        if (storage.getSearchArea() !== locationFromUrl) {
            // Use the location from the URL.
            storage.setSearchArea(locationFromUrl);
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
