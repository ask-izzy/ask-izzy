/* @flow */
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import AreYouSafe from "./AreYouSafe";
import HealthSubcategories from "./HealthSubcategories";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(HealthSubcategories) ===
            "Domestic & family violence";
    },
}: PersonalisationQuestionPage)
