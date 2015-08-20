/*
 * Enable Yadda in Mocha
 */
"use strict";

import Yadda from 'yadda';
import webDriverInstance, { executeInFlow } from './support/webdriver';
import fs from 'fs';
import Webdriver from 'selenium-webdriver';

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from './steps/steps';

import server from '../src/server';
import mockISS from './support/mock_iss/server';

new Yadda.FeatureFileSearch('./test/features').each(file => {
    featureFile(file, feature => {
        var driver;

        before(done => {
            executeInFlow(() => {
                driver = webDriverInstance();
            }, done);
        });

        scenarios(feature.scenarios, scenario => {
            steps(scenario.steps, (step, done) => {
                Yadda.createInstance(libraries, {
                    driver: driver,
                }).run(step, done);
            });
        });

        afterEach(function() {  // IMPORTANT: needs the correct 'this'
            takeScreenshotOnFailure(this.currentTest, driver);
        });

        after(done => driver.quit().then(done));
    });
});

function takeScreenshotOnFailure(test, driver) {
    if (test.state != 'passed') {
        var path = test.title.replace(/\W+/g, '_').toLowerCase() + '.png';

        driver.takeScreenshot().then(function(data) {
            fs.writeFileSync(path, data, 'base64');
        });
    }
}
