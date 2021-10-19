/* $FlowIgnore */
/* eslint-disable prefer-arrow-callback */

/*
 * Enable Yadda in Mocha
 */


import Webdriver from "selenium-webdriver";
import Yadda from "yadda";
import webDriverInstance, { cleanDriverSession } from "./support/webdriver";
import {
    takeScreenshot,
    deleteSceenshot,
    getSceenshotPath,
} from "./support/debug";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from "./steps";

/* eslint-disable no-unused-vars */
import serverAskIzzy from "../src/server"; // Start AskIzzy server
import serverMockISS from "./support/mock_iss/server"; // Start Mock ISS server
import serverMockCMS from "./support/mock-cms"; // Start Mock CMS server
/* eslint-enable no-unused-vars */

/* create the webdriver, we will reuse this promise multiple times */
const driverPromise = webDriverInstance();
let driver: Webdriver.WebDriver;
const testHarnessLog = [];
const testBrowserLog = [];
const indent = " ".repeat(10)
let testFailed = false;

let processFile = (file) => {
    featureFile(file, feature => {
        before(async function(): Promise<void> {
            driver = await driverPromise;
            await driver.executeScriptBeforeLoad(() => {
                console.log("------------- Loading Page -------------")
                console.log("URL: " + location.href)
            });
            testBrowserLog.push({
                hook: "Before feature",
                browserLog: await driver.manage().logs().get("browser"),
            })
        });

        scenarios(feature.scenarios, scenario => {
            before(async function(): Promise<void> {
                await cleanDriverSession(driver);

                await driver.executeScriptBeforeLoad(
                    await fs.readFile(
                        path.resolve(
                            __dirname,
                            "../public/static/testharness.js"
                        ),
                        "utf8"
                    )
                );

                // Flush any logs from previous tests
                testHarnessLog.length = 0
                testBrowserLog.length = 0

                testBrowserLog.push({
                    hook: "Before scenario",
                    browserLog: await driver.manage().logs().get("browser"),
                })
            });

            steps(scenario.steps, async function(step, done) {
                this.slow(6000)
                Yadda.createInstance(libraries, {
                    driver: driver,
                    mochaState: this,
                    log: testHarnessLog,
                    indent,
                }).run(step, done);
            });
        });

        afterEach(async function(): Promise<void> {
            try {
                testBrowserLog.push({
                    step: this.currentTest.title,
                    browserLog: await driver.manage().logs().get("browser"),
                })
            } catch (err) {
                console.error("Can not connect to the browser")
                return
            }
            if (this.currentTest.state !== "passed") {
                testFailed = true;
                if (testHarnessLog.length) {
                    console.log(indent + "Output from failed test or hook:")
                    console.log(
                        testHarnessLog
                            .map(line => `${indent}  ${line}`)
                            .join("\n")
                    )
                }

                console.log(indent + "Browser logs:")
                if (!testBrowserLog.some(step => step.browserLog.length)) {
                    console.log(
                        indent + `  <nothing logged>`
                    )
                } else {
                    let maxLineLength = process.stdout.columns ?
                        process.stdout.columns
                        : 100

                    await printLogs(
                        testBrowserLog, indent + "  ", maxLineLength
                    )
                }

                if (process.env.SCREENSHOT_FAILURES) {
                    try {
                        const filepath = await takeScreenshot(
                            driver,
                            getSceenshotPath(this.currentTest)
                        )

                        console.log(
                            indent + `Screenshot saved to "${filepath}"`
                        );
                    } catch (err) {
                        console.log(indent + "Failed to take screenshot");
                        console.log(indent + err);
                    }
                }
            } else {
                if (process.env.SCREENSHOT_FAILURES) {
                    if (
                        !this.currentTest.title
                            .match(/When I take a screenshot/i)
                    ) {
                        await deleteSceenshot(this.currentTest)
                    }
                }
            }
        });
    });

    async function printLogs(logs, indent, maxLineLength) {
        for (const [index, stepLog] of logs.entries()) {
            index > 0 && console.log()
            let line = ""

            if (stepLog.hook) {
                line = `${indent}Hook: ${stepLog.hook}`
            } else {
                line = `${indent}Step: ${stepLog.step}`
            }
            // Step names can be multiple lines so indent if required
            console.log(
                line.replace(/\n/g, "\n" + indent + " ".repeat(4))
            )

            for (const entry of stepLog.browserLog) {
                const logLevel = entry.level.value;
                let format

                if (logLevel >= 1000) {
                    format = chalk.red
                } else if (logLevel >= 900) {
                    format = chalk.yellow
                } else if (logLevel >= 800) {
                    format = chalk.green
                } else {
                    format = chalk.blue
                }
                const message = entry.message
                    .split("\n")
                    .join("\n  " + indent)

                // Properly indent lines that are wider than the current
                // terminal width
                let remainingLine =
                    `${indent}  ${format(entry.level.name)}: ${message}`

                while (remainingLine.length > 0) {
                    console.log(
                        remainingLine.substring(0, maxLineLength)
                    )
                    remainingLine = remainingLine.substring(
                        maxLineLength
                    )
                    if (remainingLine.length > 0) {
                        remainingLine = indent + " ".repeat(4) + remainingLine
                    }
                }
            }
        }
    }
}

/**
 * Setup webdriver and run feature tests given directory
 * @param {string} directory -Directory pathname e.g. "./test/personalisation"
 * @returns {undefined}
 */
export default function runTests(directory: string) {
    new Yadda.FeatureFileSearch(directory).each(processFile);

    after(async function(): Promise<void> {
        // I can't find a way to directly check if there has been any failed
        // tests from inside a root afterAll hook. Replace "testFailed" with a
        // cleaner solution if you come across anything.
        if (process.env.PAUSE_AFTER_FAIL && testFailed) {
            this.timeout(0)
            const port = serverAskIzzy.get("port");
            console.info(
                `Press any key to exit. (meanwhile Ask Izzy is accessible ` +
                `at: http://localhost:${port})`
            );
            process.stdin.setRawMode(true);
            process.stdin.resume();
            await new Promise(resolve => process.stdin.on("data", resolve));
        }
        await driver.quit();
    });
}
