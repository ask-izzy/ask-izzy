import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page.js"

import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe.js";
import storage from "@/src/storage.js";
import ViolenceKeywords from "@/src/constants/free-text-keywords.js";

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        const searchString = storage.getSearch();

        return ViolenceKeywords.indexOf(searchString.toLowerCase()) > -1;
    },
} as PersonalisationQuestionPage)
