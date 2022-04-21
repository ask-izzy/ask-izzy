/* @flow */
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import AreYouSafe from "./AreYouSafe";
import storage from "../../storage";
import ViolenceKeywords from "../../constants/free-text-keywords";

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        const searchString = storage.getSearch();

        return ViolenceKeywords.indexOf(searchString.toLowerCase()) > -1;
    },
}: PersonalisationQuestionPage)
