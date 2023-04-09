import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"


import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe.js";
import HealthSubcategories from "@/src/constants/personalisation-pages/HealthSubcategories.js";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"


export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(HealthSubcategories) ===
            "Domestic & family violence";
    },
} as PersonalisationQuestionPage)
