import storage from "@/src/storage";
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import OnlineSafetyScreen from "@/src/constants/personalisation-pages/OnlineSafetyScreen";
import {getSavedPersonalisationAnswer} from "@/src/utils/personalisation"

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
