/* @flow */
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import AreYouSafe from "./AreYouSafe";
import CounsellingSubcategories from "./CounsellingSubcategories";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(CounsellingSubcategories) ===
                "Scared in my relationship";
    },
}: PersonalisationQuestionPage)
