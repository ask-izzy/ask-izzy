/* @flow */

import * as React from "react";
import Storage from "../storage";
import {
    fetchAnswers,
    getSearchAnswers,
    PersonalisationLink,
} from "./QuestionStepper.service";
import Category from "../constants/Category";
import {useContext} from "react";
import classnames from "classnames"
import routerContext from "../contexts/router-context";

type Props = {
    intro?: ?boolean,
    category: ?Category,
    results?: ?boolean,
    location?: ?string,
    onClear?: ?function
}

const BREADCRUMB_LIMIT = 6;
const SCREEN_READER_MESSAGE = "Below are your currently selected answers," +
    " these are used for the search."

function QuestionStepper(
    {intro, category, results, location, onClear}: Props): React.Node {
    const [currentAnswers, setCurrentAnswers] =
        React.useState<Array<any>, function>([])
    const [showClear, setShowClear] = React.useState(false)
    const [multiSelectedAnswer, setMultiSelectedAnswer] = React.useState(
        undefined
    )

    const {router} = useContext(routerContext)

    /**
     * show the clear option if the location is set.
     * @param answers - The current answers
     * @returns {*} - returns nothing
     */
    const hasLocation = (answers): void => {
        return setShowClear(!!answers.find(
            answer => (
                answer.name.toLowerCase() === "location" &&
                answer.answer
            )
        ));
    }

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

        // If a multi answer question is being edited
        const multiAnswer = answers.find(answer =>
            editing(answer) && answer.multi
        )

        // If there is s a multi answer question and has more than one selected.
        // filter out only non multi questions and append the first multi answer
        // selection found to the answer list,
        // set the multi answer state - to ensure that when editing it will
        // only display one answer with "(editing) ..." trailing
        if (multiAnswer && Object.keys(multiAnswer).length &&
            answers.filter(ans => ans.multi).length > 1) {
            setMultiSelectedAnswer(multiAnswer)
            const notMultiAns = answers.filter((answer) => !answer.multi);
            answers = notMultiAns.concat(multiAnswer)
        }

        if (answers.length > BREADCRUMB_LIMIT) {
            setCurrentAnswers(answers.slice(0, BREADCRUMB_LIMIT));
        } else {
            setCurrentAnswers(answers);
        }
        hasLocation(answers)
    }, [])

    /**
     * This UseEffect is to ensure that the clear location does not appear on
     * when the location has been cleared, but answers still exist
     */
    React.useEffect(() => {
        hasLocation(currentAnswers)
    }, [currentAnswers])

    /**
     * Clears the location from locale storage and clears the answers.
     * @returns nothing
     */
    const clearLocation = (): void => {
        Storage.setLocation("");
        setCurrentAnswers([]);
        onClear && onClear();
    }

    /**
     * Used to render the Pipes between the answers with an option of ellipsis
     * @param ellipsis - If ellipsis are to be shown after the pipe
     * @return {JSX.Element} - returns the Pipe with or without an ellipsis
     */
    const renderPipeEllipsis = (ellipsis): React.Node => (
        <>
            <span style={{ color: "#c5c5c5", margin: 5 }}> |  </span>
            { ellipsis ? <span style={{ color: "grey" }} >...</span> : null }
        </>
    )


    /**
     * if the answer is being changed
     * @param answer - the current answer
     * @returns {boolean} - true or false if the answer is being edited
     */
    const editing = (answer): boolean => (
        answer.name === router.match.params.subpage
    )

    const RenderAnswer = ({answer}): React.Node => (
        <>
             <span>
                 { multiSelectedAnswer &&
                 multiSelectedAnswer.answer === answer.answer ?
                     (
                         <span className="editting">
                             {multiSelectedAnswer.answer}
                             <span>
                                 {" (editing) ..." }
                             </span>
                         </span>
                     ) : <span className={editing(answer) && "editting"}>
                         {answer.answer}</span> }
             </span>
            <span className="editting">
                {!multiSelectedAnswer && editing(answer) && " (editing)"}
            </span>
         </>
    )

    return (
        <div className={classnames(
            "QuestionStepper",
            results && "ResultsPage",
            !results && "QuestionFlow"
        )}
        >
            <div className="answer-box">
                <span aria-label={SCREEN_READER_MESSAGE}>
                    {currentAnswers.map((answer, index) =>
                        <span key={`${answer.name}_${index}`}>
                            <span
                                aria-label={
                                    editing(answer) ? `you are now editing ` +
                                        `${answer.answer} for ${answer.name}`
                                        : `You've selected ${answer.answer} ` +
                                        `for ${answer.name}`
                                }
                                style={{
                                    fontStyle: editing(answer) && "italic",
                                    color: !editing(answer) && !intro && "grey",
                                }}
                            >
                                <RenderAnswer answer={answer} />
                            </span>
                            {
                                answer.answer &&
                                (index + 1) < currentAnswers.length ?
                                    renderPipeEllipsis() : null
                            }
                        </span>
                    )}
                    {
                        currentAnswers.length === BREADCRUMB_LIMIT &&
                        !multiSelectedAnswer &&
                        renderPipeEllipsis(true)
                    }
                </span>
                {intro && showClear && (
                    <span>
                        <span
                            style={{
                                display: "none",
                            }}
                            aria-label="Button to clear your current location"
                        >
                            Button to clear your current location
                        </span>
                        <a
                            className="ClearButton"
                            aria-label="Button to clear your current location"
                            onClick={clearLocation}
                        >
                            Clear saved location
                        </a>
                    </span>
                )}
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
}

export default QuestionStepper
