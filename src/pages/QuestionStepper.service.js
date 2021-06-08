/* @flow */

import Category from "../constants/Category";
import * as React from "react";
import Link from "../components/Link";
import * as gtm from "../google-tag-manager";
import Storage from "../storage";
import classnames from "classnames";
import _ from "underscore";

const PERSONALISATION_EXCLUSION_LIST = [
    "online-safety-bundle",
    "online-safety-screen",
    "under-18-dfv",
    "using-violence",
]

export const INITIAL_TAB_INDEX = 4;
export const BREADCRUMB_LIMIT = 6;

export type AnswerType = {
    name: string,
    answer: ?any,
    multi: boolean,
    selection: ?string | ?number | ?boolean,
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
        if (answer.breadcrumbAnswer() instanceof Array) {
            answer.breadcrumbAnswer().forEach(nestedAnswer => {
                answerList.push({
                    name: answer.defaultProps.name,
                    answer: nestedAnswer,
                    selection: answer.breadcrumbToStandardAnswer(
                        nestedAnswer
                    ),
                    multi: true,
                })
            });
        } else {
            answerList.push({
                name: answer.defaultProps.name,
                answer: answer.breadcrumbAnswer(),
                selection: answer.breadcrumbToStandardAnswer,
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
            selection: location,
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
            selection: areYouSafe,
        })
    }
    return answerList
}

const trailingSlash = (path: string): string =>
    `${path}${path.endsWith("/") ? "" : "/"}`;

export const PersonalisationLink = ({pathname}: Object): React.Node => (
    <Link
        to={`${trailingSlash(pathname)}personalise/summary`}
        onClick={gtm.emit.bind(null, {event: "changeAnswers"})}
    >
        See all and edit
    </Link>
);

export const renderEditingIndicator = (
    answer: AnswerType,
    currentAnswers: Array<AnswerType>,
    multiSelectedAnswer: Array<AnswerType>,
    lastMultiSelect: ?number
): ?string => {
    if (!multiSelectedAnswer.length &&
        (!answer.multi || (answer.multi && lastMultiSelect &&
            currentAnswers[lastMultiSelect].answer === answer.answer))) {
        return " (editing)"
    } if (multiSelectedAnswer.length &&
            multiSelectedAnswer[multiSelectedAnswer.length - 1].answer ===
            answer.answer) {
        return " ... (editing)"
    }
    return !answer.multi ? " (editing)" : null
}


/**
 * Used to render the Pipes or commas between the answers
 * @param editing - the answer is being edited
 * @param multi - multi
 * @param lastMultiSelect - if it's the last multi select
 * @param index - index
 * @return {JSX.Element} - returns a pipe or commas
 */
export const renderPipeOrComma = (
    editing: boolean,
    multi: boolean,
    lastMultiSelect: ?number,
    index?: ?number,
): React.Node => (
    <>
        <span className={classnames("pipeOrComma", !multi && "nonMultiMargin")}>
            {multi && lastMultiSelect !== index ?
                <span className={editing ? "editing" : null}>
                    {", "}
                </span>
                : " | "}
        </span>
    </>
)


export const sortAnswers = (
    category: Category,
    answers: Array<AnswerType>,
): Array<AnswerType> => {

    // separate the answers from multi and regular
    const multiAnswers = answers.filter(answer => answer.multi);
    const regularAnswers = answers.filter(answer => !answer.multi);

    // group the multi answers by demographic
    const groupedAnswers = _.groupBy(multiAnswers, "name");

    // separate out the groups
    const groups = Object.keys(groupedAnswers);

    // get category choices
    const choices = category.personalisation.filter(
        cat => cat.defaultProps.answers &&
            groups.includes(cat.defaultProps.name)).map(cat => (
        {
            [cat.defaultProps.name]: Object.keys(cat.defaultProps.answers),
        }
    ))

    // loop through the groups and choices, and using the order of the choices
    // sort the grouped answers based of the choice order
    for (let group = 0; group < groups.length; group++) {
        for (let choice = 0; choice < choices.length; choice++) {
            groupedAnswers[groups[group]] = _.sortBy(
                groupedAnswers[groups[group]],
                (selection) => _.indexOf(
                    choices[choice][groups[group]], selection.selection)
            )
            // set the answers with the non multi and new multi answers
            answers = regularAnswers.concat(groupedAnswers[groups[group]])
        }
    }
    return answers;
}

/**
 * returns an Ellipsis ...
 * @param index - current index
 * @param multiSelectedAnswerCount - has more than 2 multi multi
 * answer selections
 * @param lastMultiSelect - The index of the last multi selection
 * @return {string|null} - returns the Ellipsis or nothing
 */
export const renderEllipsis = (
    index: number,
    multiSelectedAnswerCount: number,
    lastMultiSelect: ?number
): ?string => {
    return lastMultiSelect === index && multiSelectedAnswerCount > 0 ? " ..."
        : null
}