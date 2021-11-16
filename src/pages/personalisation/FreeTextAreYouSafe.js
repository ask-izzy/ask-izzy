/* @flow */
import BaseQuestion from "./BaseQuestion";
import {defaultProps} from "./AreYouSafe";
import type {
    PersonalisationQuestionPageDefaultProps,
} from "../../utils/personalisation";
import storage from "../../storage";
import ViolenceKeywords from "../../constants/free-text-keywords";

export default class FreeTextAreYouSafe extends BaseQuestion {
    static defaultProps: PersonalisationQuestionPageDefaultProps = defaultProps;

    static title: string = "Are you safe";

    static showInSummary(): boolean {
        return false;
    }

    static staticShowPage(): boolean {
        return true;
    }

    static showPage(): boolean {
        const searchString = storage.getSearch();

        return super.showPage() &&
            ViolenceKeywords.indexOf(searchString.toLowerCase()) > -1;
    }
}
