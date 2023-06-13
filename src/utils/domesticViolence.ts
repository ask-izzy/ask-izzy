import storage from "@/src/storage.js";
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe.js";
import OnlineSafetyScreen from "@/src/constants/personalisation-pages/OnlineSafetyScreen.js";
import {getSavedPersonalisationAnswer} from "@/src/utils/personalisation.js"

export const resetDfvOptions = (): void => {
    if (
        ["No", "I'm not sure"].includes(
            getSavedPersonalisationAnswer(AreYouSafe) as string,
        ) &&
        !getSavedPersonalisationAnswer(OnlineSafetyScreen)
    ) {
        storage.removeItem(AreYouSafe.name);
    }
}
