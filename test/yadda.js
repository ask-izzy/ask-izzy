/*
 * Enable Yadda in Mocha
 */
/* @flow */
"use strict";

import Yadda from 'yadda';
import webDriverInstance from './support/webdriver';
import fs from 'fs';
import Webdriver from 'selenium-webdriver';
import _ from 'underscore';

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from './steps/steps';

import server from '../src/server';
import mockISS from './support/mock_iss/server';

/* create the webdriver, we will reuse this promise multiple times */
var driverPromise = webDriverInstance();
var driver;

process.on('exit', () => {
    if (driver) {
        driver.quit();
    }
});

new Yadda.FeatureFileSearch('./test/features').each(file => {
    featureFile(file, feature => {

        if (shouldSkip(feature.annotations)) return;
        if (!shouldInclude(feature.annotations)) return;

        before(done => {
            driverPromise.then(driver_ => {
                driver = driver_;

                /* reset the browser */
                driver
                    .executeScript(() => {
                        try {
                            sessionStorage.clear();
                        } catch (e) {
                        }
                    })

                    .then(done);
            });
        });

        scenarios(feature.scenarios, scenario => {
            if (shouldSkip(scenario.annotations)) return;
            if (!shouldInclude(scenario.annotations)) return;

            steps(scenario.steps, (step, done) => {
                Yadda.createInstance(libraries, {
                    driver: driver,
                }).run(step, done);
            });
        });

        afterEach(function() {  // IMPORTANT: needs the correct 'this'
            takeScreenshotOnFailure(this.currentTest, driver);
        });
    });

    function shouldSkip(annotations: Object): boolean {
        var skips = (process.env.SKIP || '').split(',');

        for (var skip of skips) {
            if (annotations[skip]) return true;
        }

        return false;
    }

    function shouldInclude(annotations: Object): boolean {
        var includes = (process.env.ONLY || '').split(',');

        if (includes.length == 1 && includes[0] == '') {
            return true;  // no specific includes specified
        }

        for (var include of includes) {
            if (annotations[include]) return true;
        }

        return false;
    }
});

function takeScreenshotOnFailure(test, driver) {
    if (test.state != 'passed') {
        var path = test.title.replace(/\W+/g, '_').toLowerCase() + '.png';

        driver.takeScreenshot().then(function(data) {
            fs.writeFileSync(path, data, 'base64');
        });
    }
}
