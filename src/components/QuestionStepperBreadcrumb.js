/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";
import cnx from "classnames";
import { useRouter } from "next/router"

import MapIcon from "../icons/Map";
import Link from "./base/Link";
import {
    prettyPrintAnswer,
    getSavedPersonalisationAnswer,
} from "../utils/personalisation"
import {
    getServicesPath,
} from "@/src/utils/routing"
import type {PersonalisationPage} from "../../flow/personalisation-page"

type Props = {|
    personalisationPage: PersonalisationPage,
    personalisationPages: Array<PersonalisationPage>,
    showQuestionIcons?: ?boolean,
    contentToAppend?: ReactNode
|}

export default function QuestionStepperBreadcrumb({
    personalisationPage,
    personalisationPages,
    showQuestionIcons,
    contentToAppend,
}: Props): ReactNode {
    const router = useRouter()

    const currentlyEditing =
        personalisationPage.name === router.query.personalisationSlug


    function AnswerContainer(props): ReactNode {
        // The question stepper is also rendered on the home page. However
        // in the context of the homepage there is no category set so there
        // is no route that would make sense to link to to edit any
        // personalisation questions.
        if (currentlyEditing || !router.isReady || router.pathname === "/") {
            return <span {...props} />
        } else {
            const url = getServicesPath({router, personalisationPage})
            return (
                <Link
                    to={url}
                    {...props}
                />
            )
        }
    }

    return (
        <span className={cnx("QuestionStepperBreadcrumb", {currentlyEditing})}>
            {showQuestionIcons &&
            personalisationPage.name === "location" &&
                <MapIcon
                    aria-hidden={true}
                    viewBox="19 16 26 34"
                />
            }
            <AnswerContainer className="answer">
                {getBreadcrumbText(personalisationPage, personalisationPages)
                    .map(item => (
                        <React.Fragment
                            key={Math.random() + Date.now()}
                        >
                            {item}
                        </React.Fragment>
                    ))
                }
                {breadcrumbIsTruncated(
                    personalisationPage,
                    personalisationPages
                ) &&
                    " …"
                }
                {currentlyEditing && " (editing)"}
            </AnswerContainer>
            {contentToAppend && <span className="appendedContent">
                {contentToAppend}
            </span>}
        </span>
    )
}

export function getMaxNumberOfAnswersToShowInBreadcrumb(
    personalisationPages: Array<PersonalisationPage>
): number {
    const maxBreadcrumbs = 6;
    const numOfSingleChoicePersonalisationPages = personalisationPages.filter(
        // ternary statement required because flow is wack
        // eslint-disable-next-line no-unneeded-ternary
        page => page.multipleChoice ? false : true
    ).length

    return maxBreadcrumbs - numOfSingleChoicePersonalisationPages;
}

export function getBreadcrumbText(
    personalisationPage: PersonalisationPage,
    personalisationPages: Array<PersonalisationPage>
): Array<ReactNode> {
    const possibleAnswers = personalisationPage.possibleAnswers ||
        null

    let savedAnswers: Array<string> =
        // $FlowIgnore Flow confused about flat()
        [getSavedPersonalisationAnswer(personalisationPage)].flat()
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
                    possibleAnswers
                ).entries()
            ).map(([index, answer]) => ([answer, index]))
        )

        savedAnswers = savedAnswers.sort((answerA, answerB) =>
            possibleAnswersIndexMap[answerA] -
                possibleAnswersIndexMap[answerB]
        )

    }
    const prettyPrintedAnswers = savedAnswers.map(
        answer => prettyPrintAnswer(personalisationPage, answer)
    ).filter(answer => answer)

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
    personalisationPage: PersonalisationPage,
    personalisationPages: Array<PersonalisationPage>
): boolean {
    const prettyPrintedAnswers = [
        getSavedPersonalisationAnswer(personalisationPage),
    ].flat()
    const maxNumberOfAnswersToShow =
        getMaxNumberOfAnswersToShowInBreadcrumb(personalisationPages)
    return prettyPrintedAnswers.length > maxNumberOfAnswersToShow
}
