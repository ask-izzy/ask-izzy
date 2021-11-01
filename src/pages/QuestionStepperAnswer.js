/* @flow */

import React, {useContext} from "react";
import type {Node as ReactNode} from "react";
import cnx from "classnames";

import routerContext from "../contexts/router-context";
import MapIcon from "../icons/Map";

type Props = {|
    personalisationPage: any,
    personalisationPages: Array<any>,
    showQuestionIcons?: ?boolean,
    contentToAppend?: ReactNode
|}

export default function QuestionStepperAnswer({
    personalisationPage,
    personalisationPages,
    showQuestionIcons,
    contentToAppend,
}: Props): ReactNode {
    const {router} = useContext(routerContext)

    const currentlyEditing =
        personalisationPage.defaultProps.name === router.match.params.subpage

    return (
        <span className={cnx("QuestionStepperAnswer", {currentlyEditing})}>
            {showQuestionIcons &&
            personalisationPage.defaultProps.name === "location" &&
                <MapIcon viewBox="19 16 26 34" />
            }
            <span className="answer">
                {getBreadcrumbText(personalisationPage, personalisationPages)}
                {breadcrumbIsTruncated(
                    personalisationPage,
                    personalisationPages
                ) &&
                    " …"
                }
                {currentlyEditing && " (editing)"}
            </span>
            <span className="appendedContent">
                {contentToAppend}
            </span>
        </span>
    )
}

export function getMaxNumberOfAnswersToShowInBreadcrumb(
    personalisationPages: Array<any>
): number {
    const maxBreadcrumbs = 6;
    const numOfSingleChoicePersonalisationPages = personalisationPages.filter(
        page => !page.defaultProps.multipleChoice
    ).length

    return maxBreadcrumbs - numOfSingleChoicePersonalisationPages;
}

export function getBreadcrumbText(
    personalisationPage: any,
    personalisationPages: Array<any>
): ReactNode {
    const possibleAnswers: {[string]: any} =
        personalisationPage.defaultProps.possibleAnswers

    let savedAnswers = [personalisationPage.savedAnswer].flat()
    /* If the personalisation question is one with set answers (not the location
       page for example) then make sure the saved answers are ordered in the
       order they're listed in the question */
    if (possibleAnswers) {
        /* Build a map so we can quickly get the position of an answer as
           displayed on the question page.

           If the possible answers to a question are:
           {
               "answerA": ...,
               "answerB": ...,
               "answerC": ...,
           }

           Then possibleAnswersIndexMap will be :
           {
               "answerA": 0,
               "answerB": 1,
               "answerC": 2
           }
        */
        const possibleAnswersIndexMap = Object.fromEntries(
            Array.from(
                Object.keys(
                    personalisationPage.defaultProps.possibleAnswers
                ).entries()
            ).map(([index, answer]) => ([answer, index]))
        )

        savedAnswers = savedAnswers.sort((answerA, answerB) =>
            possibleAnswersIndexMap[answerA] -
                possibleAnswersIndexMap[answerB]
        )

    }
    const prettyPrintedAnswers = savedAnswers.map(
        answer => personalisationPage.prettyPrintAnswer(answer)
    )

    const maxNumberOfAnswersToShow =
        getMaxNumberOfAnswersToShowInBreadcrumb(personalisationPages)
    const answers = prettyPrintedAnswers.splice(0, maxNumberOfAnswersToShow)
    const answersWithCommas = []
    for (let i = 0; i < answers.length; i++) {
        answersWithCommas.push(answers[i])
        if (i < answers.length - 1) {
            answersWithCommas.push(
                <span className="breadcrumbAnswerSpacer">{", "}</span>
            )
        }
    }
    return answersWithCommas
}

export function breadcrumbIsTruncated(
    personalisationPage: any,
    personalisationPages: Array<any>
): boolean {
    const prettyPrintedAnswers = [personalisationPage.savedAnswer].flat()
    const maxNumberOfAnswersToShow =
        getMaxNumberOfAnswersToShowInBreadcrumb(personalisationPages)
    return prettyPrintedAnswers.length > maxNumberOfAnswersToShow
}
