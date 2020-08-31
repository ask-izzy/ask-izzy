/* $FlowIgnore */
/* eslint-disable prefer-arrow-callback */

/*
 * Enable Yadda in Mocha
 */


import Webdriver from "selenium-webdriver";
import command from "selenium-webdriver/lib/command";
import Yadda from "yadda";
import fs from "fs";
import webDriverInstance, { cleanDriverSession } from "./support/webdriver";
import chalk from "chalk";

Yadda.plugins.mocha.StepLevelPlugin.init();

import libraries from "./steps";

/* eslint-disable no-unused-vars */
import server from "../src/server";
import mockISS from "./support/mock_iss/server";
import serverMockCMS from "./support/mock-cms"; // Start Mock CMS server
/* eslint-enable no-unused-vars */

/* create the webdriver, we will reuse this promise multiple times */
const driverPromise = webDriverInstance();
let driver: Webdriver.WebDriver, currentTestInfoScriptId;
const currentTestLog = [];

let processFile = (file) => {
    featureFile(file, feature => {
        before(async function(): Promise<void> {
            driver = await driverPromise;

            // This command is in an unreleased version of "selenium-webdriver"
            // (at the time of writing). After the next release this code can be
            // updated to use the command from the library directly.
            driver.getExecutor().defineCommand(
                "sendAndGetDevToolsCommand",
                "POST",
                "/session/:sessionId/chromium/send_command_and_get_result"
            );

            driver.executeScriptBeforeLoad = async(script, ...args) => {
                if (typeof script === "function") {
                    script = `(${script}).apply(null, ${JSON.stringify(args)});`
                }
                return driver.getExecutor().execute(
                    new command.Command("sendAndGetDevToolsCommand")
                        .setParameter(
                            "cmd",
                            "Page.addScriptToEvaluateOnNewDocument"
                        )
                        .setParameter("params", {"source": script})
                        .setParameter("sessionId",
                            (await driver.getSession()).getId()
                        )
                )
            }
            driver.removeScriptBeforeLoad = async scriptId =>
                driver.sendDevToolsCommand(
                    "Page.removeScriptToEvaluateOnNewDocument",
                    {"identifier": scriptId}
                )

            await cleanDriverSession(driver);

            // Flush any logs from previous tests
            let logger = driver.manage().logs()
            await logger.get("browser")

            await driver.executeScriptBeforeLoad(`
                if(location.href !== 'about:blank'){
                    console.log('------------- Loading Page -------------')
                    console.log('URL: ' + location.href)
                    window.isTestEnv = true
                }
            `);

        });

        scenarios(feature.scenarios, scenario => {
            before(async function(): Promise<void> {
                // Flush any logs from previous tests
                let logger = driver.manage().logs()
                await logger.get("browser")
                currentTestLog.length = 0

                await cleanDriverSession(driver)
            });

            steps(scenario.steps, async function(step, done) {

                if (currentTestInfoScriptId) {
                    await driver.removeScriptBeforeLoad(
                        currentTestInfoScriptId.identifier
                    )
                    currentTestInfoScriptId = null
                }
                currentTestInfoScriptId = await driver.executeScriptBeforeLoad(
                    step => {
                        if (location.href !== "about:blank") {
                            console.log(`Step: ${step}`)
                        }
                    },
                    step
                );

                Yadda.createInstance(libraries, {
                    driver: driver,
                    mochaState: this,
                    log: currentTestLog,
                }).run(step, done);
            });
        });

        afterEach(async function(): Promise<void> {
            if (this.currentTest.state != "passed") {
                let title = this.currentTest.title.replace(/\W+/g, "_");
                const indent = " ".repeat(10)

                if (currentTestLog.length) {
                    console.log(indent + "Output from failed test or hook:")
                    console.log(
                        currentTestLog
                            .map(line => `${indent}  ${line}`)
                            .join("\n")
                    )
                }

                if (process.env.SCREENSHOT_FAILURES) {
                    try {
                        let data = await driver.takeScreenshot();
                        const filename = `Test-${title}.png`

                        if (process.env.SCREENSHOT_FAILURES === "base64") {
                            console.log(indent + `Screenshot "${filename}":`);
                            console.log(indent + `  Base64 PNG data: ${data}`);
                        } else {
                            console.log(
                                indent + `Screenshot saved as "${filename}"`
                            );
                            fs.writeFileSync(
                                `Test-${title}.png`,
                                data,
                                "base64"
                            );
                        }
                    } catch (err) {
                        console.log(indent + "Failed to take screenshot");
                        console.log(indent + err);
                    }
                }

                console.log(indent + "Browser logs:")

                let logger = driver.manage().logs()

                for (const entry of await logger.get("browser")) {
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
                    const message = entry.message.split("\n")
                        .join("\n    " + indent)
                    console.log(
                        indent + `  ${format(entry.level.name)}: ${message}`
                    )
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
