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
        return "atsi-and-hand"
    } else if (category) {
        return category.bannerName
    }
    return "hand-and-person-with-heart"
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
        const searchQueryChanges: Array<SearchQueryChanges> = []
        // If there are multiple answers, at most the first 2 as ordered
        // by the order they appear in the list displayed to the user
        for (const singleSavedAnswer of savedAnswer.slice(0, 2)) {
            if (!(singleSavedAnswer in possibleAnswers)) {
                console.error(
                    `Saved answer "${singleSavedAnswer}" is not a valid answer for ${personalisationPage.name}`
                )
                continue
            }
            searchQueryChanges.push(possibleAnswers[singleSavedAnswer])

        }
        return searchQueryChanges
    } else if (savedAnswer === "(skipped)") {
        // This question has been skipped.
        return {};
    } else if (savedAnswer && savedAnswer in possibleAnswers) {
        return possibleAnswers[savedAnswer]
    } else if (savedAnswer) {
        console.error(
            `Saved answer "${savedAnswer}" is not a valid answer for ${personalisationPage.name}`
        )
        return null
    } else {
        // this question hasn't been answered
        return null;
    }
}
