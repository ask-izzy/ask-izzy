import type {
    PersonalisationQuestionPage,
} from "@/types/personalisation-page"

import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import storage from "@/src/storage";
import ViolenceKeywords from "@/src/constants/free-text-keywords";

export default ({
    ...AreYouSafe,
    getShouldIncludePage(): boolean {
        const searchString = storage.getSearch();

        return ViolenceKeywords.indexOf(searchString.toLowerCase()) > -1;
    },
} as PersonalisationQuestionPage)
