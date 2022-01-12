/* @flow */
import CounsellingSubcategories from "./CounsellingSubcategories";
import BaseQuestion from "./BaseQuestion";
import {defaultProps} from "./AreYouSafe";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";

export default class CounsellingAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationQuestionPageDefaultProps = {
        ...defaultProps,
        noQuestionStepperStep: true,
    };

    static title: string = "Are you safe";

    static getShouldShowInSummary(): boolean {
        return false;
    }

    static getShouldIncludePage(): boolean {
        return CounsellingSubcategories.savedAnswer ===
                "Scared in my relationship";
    }
}
