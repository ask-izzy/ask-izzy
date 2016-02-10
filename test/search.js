/* @flow */

/*
 * Enable Yadda in Mocha
 */

import Yadda from "yadda";
import libraries from "./search-steps";

Yadda.plugins.mocha.StepLevelPlugin.init();

declare var GLOBAL: Object;

// Pass through environment variables
GLOBAL.ISS_URL = process.env.ISS_URL;
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
