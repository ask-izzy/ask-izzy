/* flow:disable */
/* eslint-disable prefer-arrow-callback */

/*
 * Enable Yadda in Mocha
 */

import "babel-polyfill";
import Webdriver from "selenium-webdriver";
import Yadda from "yadda";
import fs from "fs";
import webDriverInstance, { cleanDriverSession } from "./support/webdriver";

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from "./steps";

/* eslint-disable no-unused-vars */
import server from "../src/server";
import mockISS from "./support/mock_iss/server";
/* eslint-enable no-unused-vars */

/* create the webdriver, we will reuse this promise multiple times */
const driverPromise = webDriverInstance();
let driver: Webdriver.WebDriver;

let processFile = (file) => {
    featureFile(file, feature => {
        before(async function(): Promise<void> {
            driver = await driverPromise;

            if (process.env.BROWSER_LOGS) {
                // Flush any logs from previous tests
                let logger = driver.manage().logs()

                await logger.get("browser");
            }
        });

        scenarios(feature.scenarios, scenario => {
            before(async function(): Promise<void> {
                await cleanDriverSession(driver);
            });

            steps(scenario.steps, (step, done) => {
                Yadda.createInstance(libraries, {
                    driver: driver,
                }).run(step, done);
            });
        });

        afterEach(async function(): Promise<void> {
            if (this.currentTest.state != "passed") {
                let title = this.currentTest.title.replace(/\W+/g, "_");

                if (process.env.SCREENSHOT_FAILURES) {
                    try {
                        let data = await driver.takeScreenshot();

                        if (process.env.SCREENSHOT_FAILURES === "base64") {
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
                    let logger = driver.manage().logs()

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
}

/**
 * Setup webdriver and run feature tests given directory
 * @param {string} directory -Directory pathname e.g. "./test/personalisation"
 * @returns {undefined}
 */
export default function runTests(directory:string) {
    new Yadda.FeatureFileSearch(directory).each(processFile);

    after(async function(): Promise<void> {
        await driver.quit();
    });
}
