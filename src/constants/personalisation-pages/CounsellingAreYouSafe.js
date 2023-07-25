/* @flow */
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import AreYouSafe from "./AreYouSafe";
import CounsellingSubcategories from "./CounsellingSubcategories";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

const triggerSubcategories = [
    "Emergency support",
    "Family or relationships",
    "Sexual assault or family violence",
]

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return triggerSubcategories.includes(
            getSavedPersonalisationAnswer(CounsellingSubcategories)
        )
    },
}: PersonalisationQuestionPage)
