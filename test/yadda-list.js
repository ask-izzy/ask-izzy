/* @flow */

/*
 * List scenarios to STDOUT
 */

import Yadda from "yadda";
Yadda.plugins.mocha.StepLevelPlugin.init();

new Yadda.FeatureFileSearch("./test/features").each(file => {
    featureFile(file, feature => {
        feature.scenarios.forEach((scenario) =>
            console.log(`${feature.title} ${scenario.title}`)
        )
    });
});
