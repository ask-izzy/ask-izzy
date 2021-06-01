/* @flow */

import Category from "../constants/Category";
import * as React from "react";

const PERSONALISATION_EXCLUSION_LIST = [
    "online-safety-bundle",
    "online-safety-screen",
    "under-18-dfv",
    "using-violence",
]

export type AnswerType = {
    name: string,
    answer: ?string | ?React.Node
}

/**
 *  Fetches all the current answers
 * @param category - The category being searched
 * @param limitAnswersByQuestion - used to limit the answers returned
 * by a specific question
 * @returns {[]} - Returns an Array of answers
 */
export const fetchAnswers = (
    category: Category, limitAnswersByQuestion?: ?string | ?boolean):
    Array<AnswerType> => {

    const components = category.personalisation;
    const answers = components.filter(component => (
        !PERSONALISATION_EXCLUSION_LIST.includes(
            component.defaultProps.name) ? limitAnswersByQuestion ?
                component.defaultProps.name === limitAnswersByQuestion
                : component.breadcrumbAnswer &&
            component.breadcrumbAnswer()
            : false
    ));

    const answerList = [];
    answers.forEach(answer => {
        if (
            answer.breadcrumbAnswer &&
            answer.breadcrumbAnswer() instanceof Array
        ) {
            answer.breadcrumbAnswer().forEach(nestedAnswer => {
                answerList.push({
                    name: answer.defaultProps.name,
                    answer: nestedAnswer,
                })
            });
        } else {
            answerList.push({
                name: answer.defaultProps.name,
                answer: answer.breadcrumbAnswer(),
            });
        }
    });
    return answerList;
}
