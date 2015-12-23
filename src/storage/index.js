/* @flow */

import strategies from "./strategies/keyvalue";
import storage, {
    storeString,
    storeLength,
    storeJSON,
} from "./dsl";

storeLength("historyLength", strategies.session);
storeString("location", strategies.session);
storeJSON("coordinates", strategies.session);
storeArray("demographics", strategies.persistent);
storeString("age", strategies.persistent);
storeString("gender", strategies.persistent);
storeString("sleep-tonight", strategies.persistent);
storeString("sub-housing", strategies.persistent);
storeArray("sub-addiction", strategies.persistent);
storeArray("sub-advocacy", strategies.persistent);
storeArray("sub-advocacy-complaints", strategies.persistent);
storeArray("sub-counselling", strategies.persistent);
storeArray("sub-everyday-things", strategies.persistent);
storeArray("sub-health", strategies.persistent);
storeArray("sub-job", strategies.persistent);
storeArray("sub-legal", strategies.persistent);
storeArray("sub-life-skills", strategies.persistent);
storeArray("sub-money", strategies.persistent);
storeArray("sub-technology", strategies.persistent);

export default {
    clear(): void {
        strategies.persistent.clear();
        strategies.session.clear();
    },
    ...storage,
};
