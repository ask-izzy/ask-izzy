import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"
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
            // @ts-expect-error TODO(ts-migration): Argument of type 'string | string[]' is not assignable to parameter…
            getSavedPersonalisationAnswer(CounsellingSubcategories)
        )
    },
} as PersonalisationQuestionPage)
