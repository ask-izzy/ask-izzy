/* @flow */
import CounsellingSubcategories from "./CounsellingSubcategories";
import BaseQuestion from "./BaseQuestion";
import {defaultProps} from "./AreYouSafe";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";

export default class CounsellingAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static title: string = "Are you safe";

    static showInSummary(): boolean {
        return false;
    }

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        return super.showPage() &&
            CounsellingSubcategories.savedAnswer ===
                "Scared in my relationship";
    }
}
