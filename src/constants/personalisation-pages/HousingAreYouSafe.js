/* @flow */
import type {
    PersonalisationQuestionPage,
} from "../../../flow/personalisation-page"
import AreYouSafe from "./AreYouSafe";
import Demographics from "./Demographics";
import {
    getSavedPersonalisationAnswer,
} from "../../utils/personalisation"

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        const demoAnswer = getSavedPersonalisationAnswer(Demographics)
        return Boolean(demoAnswer) && demoAnswer
            .indexOf("Escaping family violence") > -1;
    },
}: PersonalisationQuestionPage)
