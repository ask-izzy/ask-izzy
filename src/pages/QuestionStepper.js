/* @flow */

import * as React from "react";
import {
    INITIAL_TAB_INDEX,
    BREADCRUMB_LIMIT,
    fetchAnswers,
    getSearchAnswers,
    PersonalisationLink,
    renderPipeOrComma,
    sortAnswers,
} from "./QuestionStepper.service";
import Category from "../constants/Category";

import classnames from "classnames"
import SkipToChoices from "./SkipToChoices";
import QuestionStepperAnswer from "./QuestionStepperAnswer";
import QuestionStepperClearLocation from "./QuestionStepperClearLocation";

type Props = {
    intro?: ?boolean,
    category: ?Category,
    results?: ?boolean,
    listFocused?: ?boolean,
    location?: ?string,
    onClear?: ?function,
    onTabIndex?: ?function,
}

const SCREEN_READER_MESSAGE = "Below are your currently selected answers," +
    " these are used for the search."

const ConditionalSkipToChoice = ({show, ...props}) => (
    show ? <SkipToChoices {...props}/> : null
)


function QuestionStepper(
    {
        intro,
        category,
        results,
        location,
        onClear,
        onTabIndex,
        listFocused,
    }: Props): React.Node {
    const [currentAnswers, setCurrentAnswers] =
        React.useState<Array<any>, function>([])
    const [multiSelectedAnswer, setMultiSelectedAnswer] = React.useState(
        []
    )
    const [lastMultiSelect, setLastMultiSelect] = React.useState(undefined)
    const [Accessibility, setAccessibility] = React.useState(false)

    /**
     * The UseEffect is to fetch the current answers and set them to the state
     */
    React.useEffect(() => {

        let answers = [];
        if (!category) {
            answers = getSearchAnswers()
        } else if (category) {
            answers = fetchAnswers(
                category,
                intro && "location");
        }

        answers = answers.filter((ans) => ans.answer !== "(skipped)");
        if (category) {
            answers = sortAnswers(category, answers)
        }
        // If a multi answer question is being edited
        let multiAnswer = answers.filter(answer => answer.multi)
        // If there is s a multi answer question and has more than one selected.
        // filter out only non multi questions and append the first multi answer
        // selection found to the answer list,
        // set the multi answer state - to ensure that when editing it will
        // only display one answer with " ... (editing)" trailing
        if (multiAnswer.length && multiAnswer.length > 2) {
            const notMultiAns = answers.filter((answer) => !answer.multi);
            multiAnswer = multiAnswer.slice(0, 2)
            setMultiSelectedAnswer(multiAnswer)
            answers = notMultiAns.concat(multiAnswer)
        }

        setLastMultiSelect(answers.map(ans => ans.multi).lastIndexOf(true))
        setCurrentAnswers(answers);
        onTabIndex?.(6 + answers.length)
    }, [])


    React.useEffect(() => {
        setAccessibility(false)
    }, [listFocused])

    return (
        <div
            className={classnames(
                "QuestionStepper",
                results && "ResultsPage",
                !results && "QuestionFlow"
            )}
            onFocus={() => {
                if (document.activeElement?.tabIndex &&
                    document.activeElement.tabIndex > INITIAL_TAB_INDEX &&
                    (document.activeElement.tabIndex <
                        INITIAL_TAB_INDEX + currentAnswers.length
                    )) {
                    setAccessibility(true)
                }
            }}
        >
            <ConditionalSkipToChoice
                show={!results && Accessibility}
                setAccessibility={setAccessibility}
            />
            <div className="answerBox"
                tabIndex={INITIAL_TAB_INDEX}
                style={Accessibility ? {paddingTop: 0} : {}}
            >
                <span aria-label={SCREEN_READER_MESSAGE}>
                    {currentAnswers.map((answer, index) =>
                        <QuestionStepperAnswer
                            index={index}
                            key={`${answer.name}_${index}`}
                            answer={answer}
                            intro={intro}
                            onClear={onClear}
                            currentAnswers={currentAnswers}
                            lastMultiSelect={lastMultiSelect}
                            multiSelectedAnswer={multiSelectedAnswer}
                        />
                    )}
                    {
                        currentAnswers.length === BREADCRUMB_LIMIT &&
                        !multiSelectedAnswer &&
                        renderPipeOrComma(
                            false,
                            false,
                            lastMultiSelect
                        )
                    }
                </span>
                <QuestionStepperClearLocation
                    onClear={onClear}
                    intro={intro}
                    currentAnswers={currentAnswers}
                    setCurrentAnswers={setCurrentAnswers}
                />
            </div>
            {results && location && currentAnswers.length ? (
                <div className="EditAnswers">
                    <PersonalisationLink {...location}/>
                </div>
            ) : null}
        </div>
    )
}

QuestionStepper.defaultProps = {
    intro: false,
    results: false,
    location: null,
    onClear: null,
    listFocused: false,
}

export default QuestionStepper