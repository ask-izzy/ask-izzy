import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe.js";
import Demographics from "@/src/constants/personalisation-pages/Demographics.js";
import {
    getSavedPersonalisationAnswer,
} from "@/src/utils/personalisation.js"


export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        const demoAnswer = getSavedPersonalisationAnswer(Demographics)
        return Boolean(demoAnswer) && demoAnswer
            .indexOf("Escaping family violence") > -1;
    },
} as PersonalisationQuestionPage)
