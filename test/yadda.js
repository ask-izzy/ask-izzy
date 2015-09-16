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
var sessionId: string;  // used to talk to Sauce
var driver: Webdriver.WebDriver;
var passed = true;

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
                        console.error(e);
                    }
                });

            if (process.env.BROWSER_LOGS) {
                // Flush any logs from previous tests
                var logger = new Webdriver.WebDriver.Logs(driver);
                await logger.get('browser');
            }

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

        afterEach(async function(done) {
            if (this.currentTest.state != 'passed') {
                passed = false;

                var title = this.currentTest.title.replace(/\W+/g, '_');
                var data = await driver.takeScreenshot();

                fs.writeFileSync(`Test-${title}.png`, data, 'base64');

                if (process.env.BROWSER_LOGS) {
                    var logger = new Webdriver.WebDriver.Logs(driver);

                    // N.B: iterating this causes problems but map works...
                    // very strange
                    console.log(
                        (await logger.get('browser')).map(
                            entry => `${entry.level.name}: ${entry.message}`
                        ).join('\n')
                    );
                }
            }

            done();
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

// jscs:disable
after(async function(done) {
    if (driver) {
        await driver.quit();
    }

    /* Send an update to Sauce Labs with our status */
    if (sessionId &&
        process.env.SAUCE_USERNAME &&
        process.env.SAUCE_ACCESS_KEY)
    {
        try {
            await new Promise((resolve, reject) => {
                var api = new SauceLabs({
                    username: process.env.SAUCE_USERNAME,
                    password: process.env.SAUCE_ACCESS_KEY,
                });

                api.updateJob(sessionId, {
                    passed: passed,
                }, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        } catch (e) {
            console.log("Failed updating saucelabs status");
            console.log(e);
        }

    }
    done();
});
