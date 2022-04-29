/* @flow */
import * as React from "react";
import type {Node as ReactNode} from "react";
import BaseQuestion from "./BaseQuestion";
import icons from "../../icons";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation"

// We have to declare this separately for flow to typecheck for some reason
const defaultProps: PersonalisationQuestionPageDefaultProps = {
    name: "sub-indigenous",
    question:
        "Would you like Aboriginal & Torres Strait Islander " +
        "specific services?",
    byline:
        "",
    possibleAnswers: {
        "Yes - show these first where possible": {
            $concat: {
                term: ["\"Aboriginals & Torres Strait Islanders\""],
            },
        },
        "No - show me everything": {},
    },
    icons: {
        "Yes - show these first where possible": icons.DemographicAtsi,
        "No - show me everything": icons.Blank,
    },
}

export default class DemographicsIndigenous extends BaseQuestion {
    static title: string = "Indigenous";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static prettyPrintAnswer(answer: string): ReactNode {
        switch (answer) {
        case "Yes - show these first where possible":
            return <>
                <icons.AboriginalFlag/>
                <icons.TorresStraitIslandersFlag />
            </>
        default:
            return answer
        }
    }
}
