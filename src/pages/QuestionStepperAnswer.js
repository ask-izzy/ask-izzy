/* @flow */

import * as React from "react";
import {
    INITIAL_TAB_INDEX,
    renderEditingIndicator,
    renderPipeOrComma, renderEllipsis,
} from "./QuestionStepper.service";
import routerContext from "../contexts/router-context";
import {useContext} from "react";
import type {AnswerType} from "./QuestionStepper.service";

type Props = {
    onClear: function,
    lastMultiSelect: ?number,
    index: number,
    answer: AnswerType,
    currentAnswers: Array<AnswerType>,
    multiSelectedAnswer: Array<AnswerType>,
    intro?: ?boolean
}

function QuestionStepperAnswer({
    intro,
    index,
    answer,
    currentAnswers,
    multiSelectedAnswer,
    lastMultiSelect,
}: Props): React.Node {

    const {router} = useContext(routerContext)

    /**
     * if the answer is being changed
     * @returns {boolean} - true or false if the answer is being edited
     */
    const editing = (): boolean => (
        answer.name === router.match.params.subpage
    )

    const ariaLabelText = () => {
        const selection = answer.answer || "answer";
        return editing() ?
            `You're now editing ${selection} for ${answer.name}`
            : `You've selected ${selection} for ${answer.name}`
    }

    return (
        <>
            <span tabIndex={INITIAL_TAB_INDEX + index + 1}>
                <span
                    aria-label={ariaLabelText()}
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
