/* @flow */
import BaseQuestion from "./BaseQuestion";
import { resetDfvOptions } from "../../utils/domesticViolence";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-legal",
    question: "What's happening?",
    possibleAnswers: {
        "Police and liaison officers": {
            $concat: {
                term: ["police", "(police liaison)"],
            },
            $removeElms: {
                term: ["(legal aid)"],
            },
        },
        "Legal advice": {
            $concat: {
                term: ["legal", "advice"],
            },
            $removeElms: {
                term: [
                    "legal",
                    "(legal aid)",
                    "-(coordinating bodies)",
                    "-permits",
                    "-ceremonies",
                    "-making",
                    "-checks",
                    "-electoral",
                    "-taxation",
                    "-centrelink",
                    "-immigration",
                    "-(hire of facilities)",
                ],
            },
        },
        "Domestic & family violence issues": {
            $concat: {
                term: ["(family violence)", "-police"],
            },
            $removeElms: {
                term: [
                    "(legal aid)",
                ],
            },
        },
        "Victims of crime compensation": {
            $concat: {
                term: ["victims", "of", "crime", "-police"],
            },
            $removeElms: {
                term: [
                    "legal",
                    "(legal aid)",
                    "-(coordinating bodies)",
                    "-permits",
                    "-ceremonies",
                    "-making",
                    "-checks",
                    "-electoral",
                    "-taxation",
                    "-centrelink",
                    "-immigration",
                    "-(hire of facilities)",
                ],
            },
        },
    },
    showSupportSearchBar: true,
};

export default class LegalSubcategories extends BaseQuestion {
    static title: string = "Legal";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    componentDidMount(): void {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        resetDfvOptions();
    }

    static prettyPrintAnswer(answer: string): string {
        switch (answer) {
        case "Police and liaison officers":
            return "Police & liaison officers";
        case "Domestic & family violence issues":
            return "Domestic & family violence";
        case "Victims of crime compensation":
            return "Victims of crime";
        default:
            return answer
        }
    }
}
