import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import Demographics from "@/src/constants/personalisation-pages/Demographics";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        const demoAnswer = getSavedPersonalisationAnswer(Demographics)
        return Boolean(demoAnswer) && demoAnswer
            .indexOf("Escaping family violence") > -1;
    },
} as PersonalisationQuestionPage)
