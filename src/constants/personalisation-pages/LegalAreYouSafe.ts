import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import LegalSubcategories from "@/src/constants/personalisation-pages/LegalSubcategories";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(LegalSubcategories) ===
            "Domestic & family violence issues";
    },
} as PersonalisationQuestionPage)
