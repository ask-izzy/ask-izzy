/* @flow */

import * as React from "react";
import {
    renderEditingIndicator,
    renderPipeOrComma,
    renderEllipsis,
    formatAriaLabelText,
} from "./QuestionStepper.service";
import routerContext from "../contexts/router-context";
import {useContext} from "react";
import type {AnswerType} from "./QuestionStepper.service";
import icons from "../icons";
import type {Node as ReactNode} from "react";

type Props = {
    lastMultiSelect: ?number,
    index: number,
    answer: AnswerType,
    currentAnswers: Array<AnswerType>,
    multiSelectedAnswer: Array<AnswerType>,
    intro?: ?boolean,
    home?: ?boolean,
}

function QuestionStepperAnswer({
    intro,
    home,
    index,
    answer,
    currentAnswers,
    multiSelectedAnswer,
    lastMultiSelect,
}: Props): ReactNode {

    const {router} = useContext(routerContext)

    /**
     * if the answer is being changed
     * @returns {boolean} - true or false if the answer is being edited
     */
    const editing = (): boolean => (
        answer.name === router.match.params.subpage
    )

    const MapIcon = () => home ? <icons.Map /> : null

    return (
        <>
            <span
                tabIndex="0"
                className={home ? "locationIcon" : undefined}
            >
                <MapIcon />
                <span
                    aria-label={formatAriaLabelText(answer, editing())}
                    className={
                        editing() ? "editing" : !intro ? "breadCrumbText"
                            : "introText"
                    }
                >
                    <span className={editing() ? "editing" : null}>
                        {answer?.answer} {
                            !editing() && answer.multi && renderEllipsis(
                                index,
                                multiSelectedAnswer.length,
                                lastMultiSelect
                            )
                        }
                    </span>
                    {editing() &&
                    <span className="editing">
                        {renderEditingIndicator(
                            answer, currentAnswers, multiSelectedAnswer,
                            lastMultiSelect
                        )}
                    </span>}
                </span>
                {answer.answer && (index + 1) < currentAnswers.length ?
                    renderPipeOrComma(
                        editing(),
                        answer.multi,
                        lastMultiSelect,
                        index)
                    : null
                }
            </span>
        </>
    )
}

export default QuestionStepperAnswer
