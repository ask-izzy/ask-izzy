/*
 * Record snapshots of each component
 */
"use strict";

import _ from '../../src/server';
import Webdriver, { By } from 'selenium-webdriver';
import fs from 'fs';
import webDriverInstance, {seleniumBrowser} from '../support/webdriver';
import components from '../../src/components';
import { exec } from 'child-process-promise';

describe("Visual Components", function() {
    Object.keys(components).forEach(function(name) {
        describe(name, function() {
            var baseUrl = "http://localhost:8000";
            var driver;
            var cfg;

            before(beforeAll);
            after(afterAll);
            it("looks right", checkAppearance);

            async function beforeAll(done) {
                driver = webDriverInstance();
                cfg = await seleniumBrowser(driver);
                done();
            }

            async function afterAll(done) {
                await driver.quit();
                done();
            }

            async function checkAppearance() {
                var description = `${cfg.browserName}-${cfg.version} ` +
                    `${cfg.width}x${cfg.height}`;

                // Load styleguide page
                var addr = `${baseUrl}/styleGuide/component/${name}`;
                await driver.get(addr);

                // Write screenshot
                var path = `src/components/${name}/${description}-new.png`;

                var imageData = await driver.takeScreenshot();
                fs.writeFileSync(path, imageData, 'base64');

                // Compare screenshot to original
                var orig = `src/components/${name}/${description}.png`;
                var diff = `src/components/${name}/${description}-diff.png`;
                var script =
                    `compare -metric AE '${orig}' '${path}' '${diff}'`;
                var comparison = await exec(script);
                var errorPx = parseInt(comparison.stderr);
                if (errorPx) {
                    console.log(`
                        comparing images failed (${errorPx}): ${script}`
                    );
                    console.log(`Base64 PNG data :${imageData}:`);
                    console.log("Diff image:");
                    var diffData = fs.readFileSync(diff).toString('base64');
                    console.log(`Base64 PNG data :${diffData}:`);
                    throw new Error(
                        `${errorPx} pixels difference between screenshots.`
                    );
                }
            }
        });
    });
});

var screenshots = Object.keys(components).map(screenshot);
async function screenshot(componentName, path) {
    var imageData = await driver.takeScreenshot();
    fs.writeFileSync(path, imageData, 'base64');
}
