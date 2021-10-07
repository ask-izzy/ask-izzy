/* @flow */

import * as React from "react";
import {
    BREADCRUMB_LIMIT,
    MULTI_DEFAULT_ANSWER_LIMIT,
    SCREEN_READER_MESSAGE,
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
import _ from "underscore";
import {Service} from "../iss";
import ScreenReader from "../components/ScreenReader";

type Props = {
    intro?: ?boolean,
    home?: ?boolean,
    showSkipToChoice?: ?boolean,
    category?: ?Category,
    resultsPage?: boolean,
    results?: Array<Service>,
    listFocused?: ?boolean,
    location?: ?string,
    onClear?: ?function,
    clearShowSkipToChoice?: () => void,
}

const ConditionalSkipToChoice = ({show, ...props}) => (
    show ? <SkipToChoices {...props}/> : null
)


function QuestionStepper(
    {
        intro,
        home,
        showSkipToChoice,
        clearShowSkipToChoice,
        category,
        resultsPage,
        location,
        onClear,
        results,
    }: Props): React.Node {

    const [currentAnswers, setCurrentAnswers] =
        React.useState<Array<any>, function>([])
    const [multiSelectedAnswer, setMultiSelectedAnswer] = React.useState(
        []
    )
    const [lastMultiSelect, setLastMultiSelect] = React.useState(undefined)

    /**
     * The UseEffect is to fetch the current answers and set them to the state
     */
    React.useEffect(() => {

        let savedAnswers = [];
        let maxDisplayedMultiChoiceAnswers = MULTI_DEFAULT_ANSWER_LIMIT;
        if (!category) {
            savedAnswers = getSearchAnswers()
        } else if (category) {
            savedAnswers = fetchAnswers(
                category,
                intro ? "location" : undefined
            );
        }

        // get the order the personalisation questions should be in
        const personalisationQOrder = _.uniq(
            [...savedAnswers].map(ans => ans.name)
        )

        savedAnswers = savedAnswers.filter((ans) => ans.answer !== "(skipped)");
        if (category) {
            savedAnswers = sortAnswers(category, savedAnswers)
        }
        // If a multi answer question is being edited
        let multiChoiceSavedAnswers = savedAnswers
            .filter(answer => answer.multi)

        // Changes the number of saved answers to display for multi choice
        // questions based on the number of questions answered
        if (savedAnswers.length < BREADCRUMB_LIMIT) {
            maxDisplayedMultiChoiceAnswers +=
                BREADCRUMB_LIMIT - savedAnswers.length;
        } else {
            maxDisplayedMultiChoiceAnswers +=
                savedAnswers.length - BREADCRUMB_LIMIT;
        }

        // To ensure the amount of multi selected options it's limited
        // to doesn't cause the number of breadcrumbs to exceed the limit
        maxDisplayedMultiChoiceAnswers -= (
            (savedAnswers.length - multiChoiceSavedAnswers.length) +
            maxDisplayedMultiChoiceAnswers
        ) - BREADCRUMB_LIMIT;

        // If there is s a multi answer question and has more than one selected.
        // filter out only non multi questions and append the first multi answer
        // selection found to the answer list,
        // set the multi answer state - to ensure that when editing it will
        // only display one answer with " ... (editing)" trailing
        if (
            multiChoiceSavedAnswers.length &&
            multiChoiceSavedAnswers.length > maxDisplayedMultiChoiceAnswers
        ) {
            const notMultiAns = savedAnswers.filter((answer) => !answer.multi);
            multiChoiceSavedAnswers = multiChoiceSavedAnswers
                .slice(0, maxDisplayedMultiChoiceAnswers)
            setMultiSelectedAnswer(multiChoiceSavedAnswers)
            savedAnswers = notMultiAns.concat(multiChoiceSavedAnswers)
        }

        // Sort the saved answers by the personalisation question order,
        savedAnswers = _.sortBy(
            savedAnswers,
            (answer) => _.indexOf(personalisationQOrder, answer.name)
        )


        setLastMultiSelect(savedAnswers.map(ans => ans.multi).lastIndexOf(true))
        setCurrentAnswers(savedAnswers);
    }, [])

    const getClassesNames = () => (
        classnames(
            "QuestionStepper",
            resultsPage && "ResultsPage",
            !resultsPage && "QuestionFlow"
        )
    )

    const getLandMarkTitle = (): string => {
        if (home) {
            return "Saved location."
        } else if (resultsPage) {
            return "Selected answer breadcrumb."
        } else {
            return "Previous answer breadcrumb."
        }
    }

    return (
        <div
            role="navigation"
            aria-labelledby="breadcrumb"
            className={getClassesNames()}
            aria-label={SCREEN_READER_MESSAGE}
            onBlur={() => clearShowSkipToChoice?.()}
        >
            <ScreenReader>
                <span id="breadcrumb">
                    {getLandMarkTitle()}
                </span>
            </ScreenReader>
            <ConditionalSkipToChoice
                show={!resultsPage && showSkipToChoice}
            />
            <div className="answerBox"
                style={showSkipToChoice ? {paddingTop: 0} : {}}
            >
                <span>
                    {currentAnswers.map((answer, index) =>
                        <QuestionStepperAnswer
                            index={index}
                            key={`${answer.name}_${index}`}
                            answer={answer}
                            intro={intro}
                            home={home}
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
                    tabIndex={0}
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
}

export default QuestionStepper
