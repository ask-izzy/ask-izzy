/* @flow */

/*
 * Enable Yadda in Mocha
 */

declare var GLOBAL;

import SauceLabs from "saucelabs";
import Webdriver from "selenium-webdriver";
import Yadda from "yadda";
import fs from "fs";
import webDriverInstance, {cleanDriverSession} from "./support/webdriver";

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from "./steps";

/* eslint-disable no-unused-vars */
import server from "../src/server";
import mockISS from "./support/mock_iss/server";
/* eslint-enable no-unused-vars */

const ISS_URL = process.env.ISS_URL;

/* create the webdriver, we will reuse this promise multiple times */
const driverPromise = webDriverInstance();
let sessionId: ?string, driver: Webdriver.WebDriver;
let passed = true;

new Yadda.FeatureFileSearch("./test/features").each(file => {
    featureFile(file, feature => {

        before(async function(): Promise<void> {
            driver = await driverPromise;
            sessionId = (await driver.getSession())
                .getId();

            if (process.env.BROWSER_LOGS) {
                // Flush any logs from previous tests
                let logger = new Webdriver.WebDriver.Logs(driver);

                await logger.get("browser");
            }

            // Set up ISS correctly for this test
            // Integration tests should be tagged @integration
            if (feature.annotations.integration) {
                GLOBAL.ISS_URL = ISS_URL;
            } else {
                GLOBAL.ISS_URL = "http://localhost:5000/";
            }
        });

        scenarios(feature.scenarios, scenario => {
            before(async function(): Promise<void> {
                await cleanDriverSession(await driverPromise);
            });

            steps(scenario.steps, (step, done) => {
                Yadda.createInstance(libraries, {
                    driver: driver,
                }).run(step, done);
            });
        });

        afterEach(async function(): Promise<void> {
            if (this.currentTest.state != "passed") {
                passed = false;

                let title = this.currentTest.title.replace(/\W+/g, "_");

                if (process.env.SCREENSHOT_FAILURES) {
                    try {
                        let data = await driver.takeScreenshot();

                        if (process.env.SCREENSHOT_FAILURES == "base64") {
                            console.log(`Test-${title}.png`);
                            console.log(`Base64 PNG data :${data}`);
                        } else {
                            fs.writeFileSync(
                                `Test-${title}.png`,
                                data,
                                "base64"
                            );
                        }
                    } catch (err) {
                        console.log("Failed to take screenshot");
                        console.log(err);
                    }
                }

                // This includes user actions, unhandled errors etc
                console.log(
                    await driver.executeScript(() =>
                        JSON.stringify(window.dataLayer)
                    )
                );

                if (process.env.BROWSER_LOGS) {
                    let logger = new Webdriver.WebDriver.Logs(driver);

                    // N.B: iterating this causes problems but map works...
                    // very strange
                    console.log(
                        (await logger.get("browser")).map(
                            entry => `${entry.level.name}: ${entry.message}`
                        ).join("\n")
                    );
                }
            }
        });
    });
});

after(async function(): Promise<void> {
    if (driver) {
        await driver.quit();
    }

    /* Send an update to Sauce Labs with our status */
    if (sessionId &&
        process.env.SAUCE_USERNAME &&
        process.env.SAUCE_ACCESS_KEY) {

        try {
            await new Promise((resolve, reject) => {
                let api = new SauceLabs({
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
        } catch (error) {
            console.log("Failed updating saucelabs status");
            console.log(error);
        }

    }
});
