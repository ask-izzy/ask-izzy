/*
 * Enable Yadda in Mocha
 */
"use strict";

const Yadda = require('yadda');
const Webdriver = require('selenium-webdriver');
const fs = require('fs');

Yadda.plugins.mocha.StepLevelPlugin.init();

const library = require('./steps/steps');

new Yadda.FeatureFileSearch('./test/features').each(file => {
    featureFile(file, feature => {
        let driver;
        let yadda = Yadda.createInstance(library, {
            drivers: driver
        });

        before(done => {
            executeInFlow(() => {

                driver = new Webdriver.Builder()
                    /* Overridden by SELENIUM_BROWSER */
                    .forBrowser('firefox')
                    .build();

                driver.manage().timeouts().implicitlyWait(10000);
            }, done);
        });

        scenarios(feature.scenarios, scenario => {
            steps(scenario.steps, (step, done) => {
                executeInFlow(() => {
                    yadda.run(step);
                }, done);
            });
        });

        /* IMPORTANT: needs the correct 'this' */
        afterEach(function() {
            takeScreenshotOnFailure(this.currentTest);
        });

        after(done => {
            driver.quit().then(done);
        });
    });
});

function executeInFlow(fn, done) {
    Webdriver.promise.controlFlow().execute(fn).then(function() {
        done();
    }, done);
}

function takeScreenshotOnFailure(test) {
    if (test.state != 'passed') {
        var path = 'screenshots/' +
            test.title.replace(/\W+/g, '_').toLowerCase() + '.png';

        driver.takeScreenshot().then(function(data) {
            fs.writeFileSync(path, data, 'base64');
        });
    }
}
