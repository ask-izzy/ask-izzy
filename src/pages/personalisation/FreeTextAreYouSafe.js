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

    static getShouldShowInSummary(): boolean {
        return false;
    }

    static getShouldIncludePage(): boolean {
        const searchString = storage.getSearch();

        return ViolenceKeywords.indexOf(searchString.toLowerCase()) > -1;
    }
}
