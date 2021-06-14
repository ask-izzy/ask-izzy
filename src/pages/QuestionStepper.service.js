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
    "are-you-safe",
]

const ICON_ARIALABEL_MAPPING = {
    "AboriginalFlagIcon": "Aboriginal",
    "TorresStraitIslandersFlagIcon": "TorresStraitIslander",
    "DemographicLgbtiqIcon": "LGBTIQ+",
}

export const INITIAL_TAB_INDEX = 4;
export const BREADCRUMB_LIMIT = 7;
export const MULTI_DEFAULT_ANSWER_LIMIT = 2;
export const SCREEN_READER_MESSAGE: string = "The following are your " +
    "previously selected answers."

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

    if (location) {
        answerList.push({
            name: "location",
            answer: location,
            multi: false,
            selection: location,
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
        tabIndex="0"
        aria-label="change your currently selected answers."
    >
        See all and edit
    </Link>
);

export const renderEditingIndicator = (
    answer: AnswerType,
    group: Object,
): ?string => {
    let content = " (editing)";
    if (answer.multi) {
        const currentGroup = group[answer.name]
        const groupsSize = currentGroup.length
        content = currentGroup[groupsSize - 1].answer ===
            answer.answer ? groupsSize > 1 ?
                "... (editing)" : " (editing) " : "";
    }
    return content
}


/**
 * Used to render the Pipes or commas between the answers
 * @param editing - the answer is being edited
 * @param answer - answer
 * @param group - the multi answer groups
 * @return {JSX.Element} - returns a pipe or commas
 */
export const renderPipeOrComma = (
    editing: boolean,
    answer: ?AnswerType,
    group: Object,
): React.Node => {


    let content = " | ";
    if (answer && answer.multi) {
        const currentGroup = group[answer.name]
        const groupsSize = currentGroup.length
        if (editing) {
            content = <span className="editing">
                {currentGroup[groupsSize - 1].answer ===
            answer.answer ? " | " : ", "}
            </span>
        } else {
            content = currentGroup[groupsSize - 1].answer ===
            answer.answer ? " | " : ", ";
        }

    }

    return <>
            <span className={classnames(
                "pipeOrComma",
                answer && !answer.multi && "nonMultiMargin")}
            >
                {content}
            </span>
    </>
}


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

    let tempAnswers = [];
    // loop through the groups and choices, and using the order of the choices
    // sort the grouped answers based of the choice order
    for (let group = 0; group < groups.length; group++) {
        for (let choice = 0; choice < choices.length; choice++) {
            groupedAnswers[groups[group]] = _.sortBy(
                groupedAnswers[groups[group]],
                (selection) => _.indexOf(
                    choices[choice][groups[group]], selection.selection)
            )
        }
        tempAnswers = tempAnswers.concat(groupedAnswers[groups[group]])
    }
    return regularAnswers.concat(tempAnswers);
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

export const editing = (answer: AnswerType, router: any): boolean => (
    answer.name === router.match.params.subpage
)

/**
 * This will generate the Aria Label and convert
 * icons to text based on their icon class
 * @param answer - the current answer
 * @param editing - is it being edited
 * @param container - For Question stepper container
 * @return {string} - The aria label text
 */
export const formatAriaLabelText = (
    answer: AnswerType,
    editing: boolean,
    container: ?boolean,
): string => {
    let selection = answer.answer || "answer";

    if (typeof selection === "object" && selection?.props.children) {
        const nodes = selection.props.children;
        if (nodes.length) {
            const nodes = selection.props.children;
            selection = nodes.map(node =>
                ICON_ARIALABEL_MAPPING[node.props.iconClass] ||
                node.props.iconClass).join(" and ")
        } else if (!nodes.length) {
            selection = ICON_ARIALABEL_MAPPING[nodes.props.iconClass] ||
                nodes.props.iconClass
        }
    }

    if (container) {
        return `${selection} for ${answer.name}`;
    }

    return editing ?
        `You're now editing ${selection} for ${answer.name}`
        : `You've selected ${selection} for ${answer.name}`
}
