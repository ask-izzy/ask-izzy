/*
 * Enable Yadda in Mocha
 */
/* @flow */
"use strict";

import SauceLabs from 'saucelabs';
import Webdriver from 'selenium-webdriver';
import Yadda from 'yadda';
import _ from 'underscore';
import fs from 'fs';
import webDriverInstance from './support/webdriver';

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from './steps/steps';

import server from '../src/server';
import mockISS from './support/mock_iss/server';

/* create the webdriver, we will reuse this promise multiple times */
var driverPromise = webDriverInstance();
var sessionId;  // used to talk to Sauce
var driver;

process.on('exit', (code) => {
    /* Important, event loop has ended, no async */
    if (driver) {
        driver.quit();
    }

    /* Send an update to Sauce Labs with our status */
    if (sessionId &&
        process.env.SAUCE_USERNAME &&
        process.env.SAUCE_ACCESS_KEY)
    {
        var api = new SauceLabs({
            username: process.env.SAUCE_USERNAME,
            password: process.env.SAUCE_ACCESS_KEY,
        });

        api.updateJob(sessionId, {
            passed: code == 0,
        });
    }
});

new Yadda.FeatureFileSearch('./test/features').each(file => {
    featureFile(file, feature => {

        if (shouldSkip(feature.annotations)) return;
        if (!shouldInclude(feature.annotations)) return;

        // jscs:disable
        before(async function(done) {
            driver = await driverPromise;
            sessionId = (await driver .getSession())
                .getId();

            await driver
                .executeScript(() => {
                    try {
                        sessionStorage.clear();
                    } catch (e) {
                    }
                });

            done();
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
