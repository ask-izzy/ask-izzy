import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe.js";
import CounsellingSubcategories from "@/src/constants/personalisation-pages/CounsellingSubcategories.js";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"


export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(CounsellingSubcategories) ===
                "Scared in my relationship";
    },
} as PersonalisationQuestionPage)
