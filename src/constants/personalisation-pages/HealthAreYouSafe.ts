import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"

import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import HealthSubcategories from "@/src/constants/personalisation-pages/HealthSubcategories";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        return getSavedPersonalisationAnswer(HealthSubcategories) ===
            "Domestic & family violence";
    },
} as PersonalisationQuestionPage)
