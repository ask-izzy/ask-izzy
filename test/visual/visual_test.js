/*
 * Record snapshots of each component
 */
"use strict";

import _ from '../../src/server';
import Webdriver, { By } from 'selenium-webdriver';
import fs from 'fs';
import webDriverInstance, {seleniumBrowser} from '../support/webdriver';
import components from '../../src/components';

describe("Visual Components", function() {
    var baseUrl = "http://localhost:8000";
    var driver;
    var cfg;

    before(beforeAll);
    after(afterAll);

    async function beforeAll(done) {
        driver = webDriverInstance();
        cfg = await seleniumBrowser(driver);
        done();
    }

    async function afterAll(done) {
        await driver.quit();
        done();
    }

    Object.keys(components).forEach(function(name) {
        describe(name, function() {

            it("looks right", checkAppearance);

            async function checkAppearance() {
                var description = `${cfg.browserName}-${cfg.version} ` +
                    `${cfg.width}x${cfg.height}`;
                var orig = `src/components/${name}/${description}.png`;

                // Try to create the output dir.
                try {
                    fs.mkdirSync(`src/components/${name}`);
                } catch (e) {}

                // Enable just generating the missing images
                if (process.env.ONLY_NEW && fs.existsSync(orig)) {
                    return;
                }

                // Load styleguide page
                var addr = `${baseUrl}/styleGuide/component/${name}`;
                await driver.get(addr);

                // Write screenshot
                var imageData = await driver.takeScreenshot();
                fs.writeFileSync(orig, imageData, 'base64');
            }
        });
    });
});

var screenshots = Object.keys(components).map(screenshot);
async function screenshot(componentName, path) {
    var imageData = await driver.takeScreenshot();
    fs.writeFileSync(path, imageData, 'base64');
}
