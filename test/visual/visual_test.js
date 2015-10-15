/* @flow */

/*
 * Record snapshots of each component
 */

/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */
import fs from "fs";

import components from "../../src/components";
import webDriverInstance, {seleniumBrowser} from "../support/webdriver";

/* eslint-disable no-unused-vars */
import startServer from "../../src/server";

describe("Visual Components", function() {
    const baseUrl = "http://localhost:" + process.env.PORT;
    let driver, cfg;

    before(beforeAll);
    after(afterAll);

    async function beforeAll(): Promise<void> {
        driver = await webDriverInstance();
        cfg = await seleniumBrowser(driver);
    }

    async function afterAll(): Promise<void> {
        if (!driver) {
            return
        }
        await driver.quit();
    }

    Object.keys(components).forEach(function(name) {
        describe(name, function() {

            it("looks right", checkAppearance);

            async function checkAppearance() {
                if (!cfg) {
                    throw new Error(
                        "Selenium browser config must be set in beforeAll."
                    );
                }
                if (!driver) {
                    throw new Error(
                        "Driver must be setup in beforeAll"
                    );
                }
                let description = `${cfg.browserName}-${cfg.version} ` +
                    `${cfg.width}x${cfg.height}`;
                let orig = `src/components/${name}/${description}.png`;

                // Try to create the output dir.
                try {
                    fs.mkdirSync(`src/components/${name}`);
                } catch (error) {
                    // pass
                }

                // Enable just generating the missing images
                if (process.env.ONLY_NEW && fs.existsSync(orig)) {
                    return;
                }

                // Load styleguide page
                let addr = `${baseUrl}/styleGuide/component/${name}`;

                await driver.get(addr);

                // Write screenshot
                let imageData = await driver.takeScreenshot();

                fs.writeFileSync(orig, imageData, "base64");
            }
        });
    });
});
