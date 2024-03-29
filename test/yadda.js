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

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from "./steps";

let driverPromise: Promise<Webdriver.WebDriver>,
    driver: Webdriver.WebDriver;
const testHarnessLog = [];
const testBrowserLog = [];
const indent = " ".repeat(10)
let testFailed = false;

let processFile = (file) => {
    featureFile(file, feature => {
        before(async function(): Promise<void> {
            driver = await driverPromise;
            testBrowserLog.push({
                hook: "Before feature",
                browserLog: await driver.manage().logs().get("browser"),
            })
        });

        scenarios(feature.scenarios, scenario => {
            before(async function(): Promise<void> {
                // Since we now build pages on request when running the tests the first load of a page
                // maybe very slow
                this.slow(2 * 1000)
                this.timeout(40 * 1000)
                await cleanDriverSession(driver, this);

                await driver.executeScriptBeforeLoad(() => {
                    console.log("------------- Loading Page -------------")
                    console.log("URL: " + location.href)
                });

                // Flush any logs from previous tests
                testHarnessLog.length = 0
                testBrowserLog.length = 0

                testBrowserLog.push({
                    hook: "Before scenario",
                    browserLog: await driver.manage().logs().get("browser"),
                })
            });

            steps(scenario.steps, async function(step, done) {
                this.slow(4 * 1000)
                this.timeout(12 * 1000)
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
                const browserLog = await Promise.race([
                    driver.manage().logs().get("browser"),
                    new Promise((resolve, reject) => setTimeout(reject, 1000 * 5)),
                ])

                testBrowserLog.push({
                    step: this.currentTest.title,
                    browserLog,
                })
            } catch (err) {
                console.error("Can't connect to the browser so can't fetch browser logs")
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
            } else {
                if (
                    !this.currentTest.title
                        .match(/I take a screenshot/i)
                ) {
                    await deleteSceenshot(this.currentTest)
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
                    `${indent}  ${format(entry.level.name)}: ${message.replace(/webpack-internal:\/\/\/\./, ".")}`

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
    if (!process.env.PORT) {
        throw Error("Env var PORT must be set")
    }

    driverPromise = webDriverInstance();
    new Yadda.FeatureFileSearch(directory).each(processFile);

    after(async function(): Promise<void> {
        // Handle cleanup asynchronously so that in cases of test failures
        // the server can remain up until the user chooses to exit it without
        // blocking the after hook from exiting. We went to avoid blocking the
        // after hook because mocha won't print the test results summary until
        // after the after hook has exited.
        handleExit(driverPromise)
    });
}

async function handleExit(driverPromise) {
    // We need to wait a bit to make sure that mocha has printed the test
    // results summary first
    await new Promise(resolve => setTimeout(resolve, 300))
    // I can't find a way to directly check if there has been any failed
    // tests from inside a root afterAll hook. Replace "testFailed" with a
    // cleaner solution if you come across anything.
    if (process.env.PAUSE_AFTER_FAIL && testFailed) {
        const port = process.env.PORT;
        console.info(
            `Press any key to exit. (meanwhile Ask Izzy is accessible ` +
            `at: http://localhost:${port})`
        );
        process.stdin.setRawMode(true);
        process.stdin.resume();
        await new Promise(resolve => process.stdin.on("data", resolve));
    }
    const driver = await driverPromise
    driver.quit()
    process.exit(testFailed ? 1 : 0)
}
