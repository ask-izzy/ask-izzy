/* @flow */
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import AreYouSafe from "./AreYouSafe";
import LegalSubcategories from "./LegalSubcategories";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(LegalSubcategories) ===
            "Domestic & family violence issues";
    },
}: PersonalisationQuestionPage)
