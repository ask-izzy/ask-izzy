/*
 * Enable Yadda in Mocha
 */
"use strict";

const Yadda = require('yadda');

Yadda.plugins.mocha.StepLevelPlugin.init();

const library = require('./steps/steps');

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
