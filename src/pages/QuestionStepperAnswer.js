/* @flow */

import * as React from "react";
import {
    renderEditingIndicator,
    renderPipeOrComma,
    renderEllipsis,
    formatAriaLabelText,
    INITIAL_TAB_INDEX,
} from "./QuestionStepper.service";
import routerContext from "../contexts/router-context";
import {useContext} from "react";
import type {AnswerType} from "./QuestionStepper.service";
import icons from "../icons";

type Props = {
    onClear: function,
    onTabIndex: function,
    lastMultiSelect: ?number,
    index: number,
    answer: AnswerType,
    currentAnswers: Array<AnswerType>,
    multiSelectedAnswer: Array<AnswerType>,
    intro?: ?boolean,
    home?: ?boolean,
    initialTabIndex: number,
    resultsPage: ?boolean,
}

function QuestionStepperAnswer({
    intro,
    home,
    index,
    answer,
    currentAnswers,
    multiSelectedAnswer,
    lastMultiSelect,
    onTabIndex,
    initialTabIndex,
    resultsPage,
}: Props): React.Node {

    const {router} = useContext(routerContext)

    /**
     * if the answer is being changed
     * @returns {boolean} - true or false if the answer is being edited
     */
    const editing = (): boolean => (
        answer.name === router.match.params.subpage
    )

    const getInitialTabIndex = (
        resultsPage: ?boolean,
        initialTabIndex: ?number,
        additional?: ?number
    ): number => (
        resultsPage ? 0
            : ((initialTabIndex || initialTabIndex === 0 ? initialTabIndex
                : INITIAL_TAB_INDEX)) + (additional || 0)
    )

    const MapIcon = () => home ? <icons.Map /> : null

    return (
        <>
            <span
                tabIndex={getInitialTabIndex(
                    resultsPage,
                    initialTabIndex,
                    index + 1,
                )}
                onFocus={() => {
                    onTabIndex(getInitialTabIndex(
                        resultsPage,
                        initialTabIndex,
                        (index + 1) + 1,
                    ))
                }}
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
