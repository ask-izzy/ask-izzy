/* @flow */

import Category from "../constants/Category";
import * as React from "react";
import {Link} from "react-router-dom";
import * as gtm from "../google-tag-manager";
import Storage from "../storage";

const PERSONALISATION_EXCLUSION_LIST = [
    "online-safety-bundle",
    "online-safety-screen",
    "under-18-dfv",
    "using-violence",
]

export type AnswerType = {
    name: string,
    answer: ?string | ?React.Node,
    multi: boolean
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
                    multi: true,
                })
            });
        } else {
            answerList.push({
                name: answer.defaultProps.name,
                answer: answer.breadcrumbAnswer(),
                multi: false,
            });
        }
    });
    return answerList;
}

/**
 * Because when searching for a result, no category can be specified.
 * Only the location and Are you safe (if searching for domestic violence)
 * are required to be answered because the results page. we will need to fetch
 * then manually.
 * @return {[]} - an array of answers
 */
export const getSearchAnswers = (): Array<AnswerType> => {
    const answerList = [];
    const location = Storage.getLocation()
    const areYouSafe = Storage.getItem("are-you-safe")

    if (location) {
        answerList.push({
            name: "location",
            answer: location,
            multi: false,
        })
    }
    if (areYouSafe) {
        let answer;
        switch (areYouSafe) {
        case "Yes":
            answer = "Safe";
            break;
        case "No":
            answer = "Not safe";
            break;
        default:
            answer = areYouSafe;
            break;
        }
        answerList.push({
            name: "areYouSafe",
            answer: answer,
            multi: false,
        })
    }
    return answerList
}



const trailingSlash = (path: string): string =>
    `${path}${path.endsWith("/") ? "" : "/"}`;

export const PersonalisationLink = ({pathname}: Object) => (
    <div
        className="edit"
        style={{
            fontSize: "large",
        }}
    >
        <Link
            to={`${trailingSlash(pathname)}personalise/summary`}
            onClick={gtm.emit.bind(null, {event: "changeAnswers"})}
        >
            See all and edit
        </Link>
    </div>
);

