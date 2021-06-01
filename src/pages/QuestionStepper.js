/* @flow */

import * as React from "react";
import Storage from "../storage";
import {fetchAnswers} from "./QuestionStepper.service";
import Category from "../constants/Category";
import {useContext} from "react";
import routerContext from "../contexts/router-context";

type Props = {
    intro?: ?boolean,
    category: ?Category
}

const BREADCRUMB_LIMIT = 6;
const SCREEN_READER_MESSAGE = "Below are your currently selected answers," +
    " these are used for the search."

function QuestionStepper({intro, category}: Props): React.Node {
    const [currentAnswers, setCurrentAnswers] =
        React.useState<Array<any>, function>([])
    const [showClear, setShowClear] = React.useState(false)

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
        let answers = category ? fetchAnswers(
            category,
            intro && "location") : [];
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
    }

    /**
     * if the answer is being changed
     * @param answer - the current answer
     * @returns {boolean} - true or false if the answer is being edited
     */
    const editing = (answer): boolean => (
        answer.name === router.match.params.subpage
    )

    return (
        <div className="QuestionStepper">
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
                                {answer.answer}
                                {editing(answer) && " (editing)"}
                            </span>
                            {
                                answer.answer &&
                                (index + 1) < currentAnswers.length &&
                                <span>  |  </span>
                            }
                        </span>
                    )}
                    {currentAnswers.length === BREADCRUMB_LIMIT && " | ..."}
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
                            Clear Saved Location
                        </a>
                    </span>
                )}
            </div>
        </div>
    )
}

QuestionStepper.defaultProps = {
    intro: false,
}

export default QuestionStepper
