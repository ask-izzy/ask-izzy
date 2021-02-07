/* $FlowIgnore */
/*
 * Enable Yadda in Mocha
 */

require("@babel/register");
require("core-js");
require("regenerator-runtime/runtime");
import Yadda from "yadda";
import libraries from "./search-steps";

Yadda.plugins.mocha.StepLevelPlugin.init();

declare var global: Object;

// Pass through environment variables. Note that we should really be
// using `GLOBAL.ISS_URL = proces.env.ISS_URL;` here, but this would
// set `ISS_URL` to `https://iss3.docker.dev` in CI, which doesn't
// have the data that these tests expect.
global.ISS_URL = "https://UNDFUUWCHWGIJGTGMTBXZJDENAACETNJ:XBKSEBMIGVELOOSTGZFEJHKZWCKAFZUY@api.serviceseeker.com.au";
global.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

new Yadda.FeatureFileSearch("./test/search").each(file => {
    featureFile(file, feature => {
        scenarios(feature.scenarios, scenario => {
            steps(scenario.steps, (step, done) => {
                Yadda.createInstance(libraries, {}).run(step, done);
            });
        });
    });
});
