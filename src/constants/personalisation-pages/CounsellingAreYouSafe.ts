import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"
import AreYouSafe from "./AreYouSafe";
import CounsellingSubcategories from "@/src/constants/personalisation-pages/CounsellingSubcategories";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(CounsellingSubcategories) ===
                "Scared in my relationship";
    },
} as PersonalisationQuestionPage)
