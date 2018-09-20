/* flow:disable */
/*
 * Enable Yadda in Mocha
 */

import "babel-polyfill";
import Yadda from "yadda";
import libraries from "./search-steps";

Yadda.plugins.mocha.StepLevelPlugin.init();

declare var GLOBAL: Object;

// Pass through environment variables. Note that we should really be
// using `GLOBAL.ISS_URL = proces.env.ISS_URL;` here, but this would
// set `ISS_URL` to `https://iss3.docker.dev` in CI, which doesn't
// have the data that these tests expect.
GLOBAL.ISS_URL = "https://UNDFUUWCHWGIJGTGMTBXZJDENAACETNJ:XBKSEBMIGVELOOSTGZFEJHKZWCKAFZUY@api.serviceseeker.com.au";
GLOBAL.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

new Yadda.FeatureFileSearch("./test/search").each(file => {
    featureFile(file, feature => {
        scenarios(feature.scenarios, scenario => {
            steps(scenario.steps, (step, done) => {
                Yadda.createInstance(libraries, {}).run(step, done);
            });
        });
    });
});
