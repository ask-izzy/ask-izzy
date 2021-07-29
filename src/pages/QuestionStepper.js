/* @flow */

import * as React from "react";
import {
    INITIAL_TAB_INDEX,
    BREADCRUMB_LIMIT,
    MULTI_DEFAULT_ANSWER_LIMIT,
    fetchAnswers,
    getSearchAnswers,
    PersonalisationLink,
    renderPipeOrComma,
    sortAnswers,
    getInitialTabIndex,
} from "./QuestionStepper.service";
import Category from "../constants/Category";

import classnames from "classnames"
import SkipToChoices from "./SkipToChoices";
import QuestionStepperAnswer from "./QuestionStepperAnswer";
import QuestionStepperClearLocation from "./QuestionStepperClearLocation";
import _ from "underscore";
import {Service} from "../iss";

type Props = {
    intro?: ?boolean,
    home?: ?boolean,
    category?: ?Category,
    resultsPage?: boolean,
    results?: Array<Service>,
    listFocused?: ?boolean,
    location?: ?string,
    onClear?: ?function,
    onTabIndex?: ?function,
    initialTabIndex?: number,
}

const SCREEN_READER_MESSAGE = "Below are your currently selected answers," +
    " these are used for the search."

const ConditionalSkipToChoice = ({show, ...props}) => (
    show ? <SkipToChoices {...props}/> : null
)


function QuestionStepper(
    {
        intro,
        home,
        category,
        resultsPage,
        location,
        onClear,
        onTabIndex,
        listFocused,
        results,
        initialTabIndex = 0,
    }: Props): React.Node {

    const [currentAnswers, setCurrentAnswers] =
        React.useState<Array<any>, function>([])
    const [multiSelectedAnswer, setMultiSelectedAnswer] = React.useState(
        []
    )
    const [lastMultiSelect, setLastMultiSelect] = React.useState(undefined)
    const [Accessibility, setAccessibility] = React.useState(false)
    const [tabIndex, setTabIndex] = React.useState(INITIAL_TAB_INDEX + 1)

    /**
     * The UseEffect is to fetch the current answers and set them to the state
     */
    React.useEffect(() => {

        let answers = [];
        let multiAnswerLimit = MULTI_DEFAULT_ANSWER_LIMIT;
        if (!category) {
            answers = getSearchAnswers()
        } else if (category) {
            answers = fetchAnswers(
                category,
                intro && "location");
        }
        // get the order the personalisation questions should be in
        const personalisationQOrder = _.uniq([...answers].map(ans => ans.name))

        answers = answers.filter((ans) => ans.answer !== "(skipped)");
        if (category) {
            answers = sortAnswers(category, answers)
        }
        // If a multi answer question is being edited
        let multiAnswer = answers.filter(answer => answer.multi)

        // changes the amount of multi selected answers it
        // will be limited to based on the BREADCRUMB_LIMIT
        if (answers.length < BREADCRUMB_LIMIT) {
            multiAnswerLimit += BREADCRUMB_LIMIT - answers.length;
        } else if (answers.length >= BREADCRUMB_LIMIT) {
            multiAnswerLimit += answers.length - BREADCRUMB_LIMIT;
        }

        // To ensure the amount of multi selected options it's limited
        // to doesn't cause the number of breadcrumbs to exceed the limit
        multiAnswerLimit -= ((answers.length - multiAnswer.length) +
            multiAnswerLimit) - BREADCRUMB_LIMIT;

        // If there is s a multi answer question and has more than one selected.
        // filter out only non multi questions and append the first multi answer
        // selection found to the answer list,
        // set the multi answer state - to ensure that when editing it will
        // only display one answer with " ... (editing)" trailing
        if (multiAnswer.length && multiAnswer.length > multiAnswerLimit) {
            const notMultiAns = answers.filter((answer) => !answer.multi);
            multiAnswer = multiAnswer.slice(0, multiAnswerLimit)
            setMultiSelectedAnswer(multiAnswer)
            answers = notMultiAns.concat(multiAnswer)
        }

        // Sort the answers by the personalisation question order,
        answers = _.sortBy(
            answers,
            (answer) => _.indexOf(personalisationQOrder, answer.name)
        )


        setLastMultiSelect(answers.map(ans => ans.multi).lastIndexOf(true))
        setCurrentAnswers(answers);
        onTabIndex?.(resultsPage ? 0
            : getInitialTabIndex(resultsPage, initialTabIndex) + answers.length)
    }, [])

    const getClearLocationTabIndex = () => (
        (initialTabIndex || INITIAL_TAB_INDEX) + 1
    )

    React.useEffect(() => {
        setAccessibility(false)
    }, [listFocused])

    const getClassesNames = () => (
        classnames(
            "QuestionStepper",
            resultsPage && "ResultsPage",
            !resultsPage && "QuestionFlow"
        )
    )

    return (
        <div
            className={getClassesNames()}
            onKeyDown={(evt) => {
                if (evt.key === "Tab") {
                    if (document.activeElement?.tabIndex &&
                        document.activeElement.tabIndex >
                        getInitialTabIndex(
                            resultsPage, initialTabIndex
                        ) !== 0 &&
                        (document.activeElement.tabIndex <
                            getInitialTabIndex(resultsPage, initialTabIndex) +
                            currentAnswers.length
                        )) {
                        setAccessibility(true)
                    }
                }
            }}
        >
            <ConditionalSkipToChoice
                show={!resultsPage && Accessibility}
                tabIndex={tabIndex}
                setAccessibility={setAccessibility}
            />
            <div className="answerBox"
                tabIndex={getInitialTabIndex(resultsPage, initialTabIndex)}
                style={Accessibility ? {paddingTop: 0} : {}}
            >
                <span aria-label={SCREEN_READER_MESSAGE}>
                    {currentAnswers.map((answer, index) =>
                        <QuestionStepperAnswer
                            index={index}
                            key={`${answer.name}_${index}`}
                            answer={answer}
                            intro={intro}
                            home={home}
                            resultsPage={resultsPage}
                            initialTabIndex={initialTabIndex}
                            onClear={onClear}
                            onTabIndex={(index) => setTabIndex(index)}
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
                    home={home}
                    tabIndex={getClearLocationTabIndex()}
                    currentAnswers={currentAnswers}
                    setCurrentAnswers={setCurrentAnswers}
                />
            </div>
            {(resultsPage && results && results.length) &&
            location && currentAnswers.length ? (
                    <div className="EditAnswers">
                        <PersonalisationLink {...location}/>
                    </div>
                ) : null}
        </div>
    )
}

QuestionStepper.defaultProps = {
    intro: false,
    resultsPage: false,
    results: ([]: Array<any>),
    home: false,
    location: null,
    onClear: null,
    listFocused: false,
    initialTabIndex: INITIAL_TAB_INDEX,
}

export default QuestionStepper
