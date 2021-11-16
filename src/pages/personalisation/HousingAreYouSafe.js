/* @flow */
import Demographics from "./Demographics";
import BaseQuestion from "./BaseQuestion";
import {defaultProps} from "./AreYouSafe";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";

export default class HousingAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static title: string = "Are you safe";

    static showInSummary(): boolean {
        return false;
    }

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        return Boolean(super.showPage() && Demographics.savedAnswer &&
            Demographics.savedAnswer.indexOf("Escaping family violence") > -1);
    }
}
