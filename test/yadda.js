/*
 * Enable Yadda in Mocha
 */
"use strict";

import Yadda from "yadda";
import library from './steps/steps';

Yadda.plugins.mocha.StepLevelPlugin.init();

new Yadda.FeatureFileSearch('./test/features').each(file => {
    featureFile(file, feature => {
        let yadda = Yadda.createInstance(library);

        scenarios(feature.scenarios, scenario => {
            steps(scenario.steps, step => {
                yadda.run(step);
            });
        });
    });
});
