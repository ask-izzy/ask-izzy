/* @flow */

import * as React from "react";
import Storage from "../storage";
import type {AnswerType} from "./QuestionStepper.service";
import ScreenReader from "../components/ScreenReader";

type Props = {
    setCurrentAnswers: function,
    onClear: function,
    currentAnswers: Array<AnswerType>,
    intro?: ?boolean
}

function QuestionStepperClearLocation(
    {
        setCurrentAnswers,
        onClear,
        currentAnswers,
        intro,
    }: Props): React.Node | null {

    const [showClear, setShowClear] = React.useState(false)

    /**
     * show the clear option if the location is set.
     * @param answers - The current answers
     * @returns {*} - returns nothing
     */
    const hasLocation = (answers): void => {
        setShowClear(!!answers.find(
            answer => (
                answer.name.toLowerCase() === "location" &&
                answer.answer
            )
        ));
    }


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
     * This UseEffect is to ensure that the clear location does not appear on
     * when the location has been cleared, but answers still exist
     */
    React.useEffect(() => {
        hasLocation(currentAnswers)
    }, [currentAnswers])

    React.useEffect(() => {
        hasLocation(currentAnswers)
    }, [])

    if (showClear && intro) {
        return (
            <span>
                <ScreenReader
                    ariaLabel="Button to clear your current location"
                >
                    Button to clear your current location
                </ScreenReader>
                <a
                    className="ClearButton"
                    aria-label="Button to clear your current location"
                    onClick={clearLocation}
                >
                    Clear saved location
                </a>
            </span>
        )
    }
    return null;
}

QuestionStepperClearLocation.defaultProps = {
    intro: false,
}

export default QuestionStepperClearLocation
