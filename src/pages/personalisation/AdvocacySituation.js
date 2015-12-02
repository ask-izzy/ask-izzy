/* @flow */

import TextEntryQuestion from "./TextEntryQuestion";

export default class AdvocacySituation extends TextEntryQuestion {
    static propTypes = TextEntryQuestion.propTypes;
    static defaultProps = {
        name: "advocacy-situation",
        question: "What situation do you need help with?",
        placeholder: "Please describe the situation here " +
            "eg: housing, family violence, legal etc.",
        answers: {},
    };

    static summaryLabel = "Your situation";
}
