import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe.js";
import LegalSubcategories from "@/src/constants/personalisation-pages/LegalSubcategories.js";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"


export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(LegalSubcategories) ===
            "Domestic & family violence issues";
    },
} as PersonalisationQuestionPage)
