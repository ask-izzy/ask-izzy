/* $FlowIgnore */
/*
 * Enable Yadda in Mocha
 */

require("@babel/register");
require("core-js");
require("regenerator-runtime/runtime");
import Yadda from "yadda";
import libraries from "./search-steps";

Yadda.plugins.mocha.StepLevelPlugin.init();

declare var global: Object;

global.ISS_URL = process.env.ISS_URL_PROD;
global.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

new Yadda.FeatureFileSearch("./test/search").each(file => {
    featureFile(file, feature => {
        scenarios(feature.scenarios, scenario => {
            steps(scenario.steps, (step, done) => {
                Yadda.createInstance(libraries, {}).run(step, done);
            });
        });
        afterEach(async function(): Promise<void> {
            const indent = " ".repeat(10)

            if (this.currentTest.state != "passed") {
                console.error(
                    this.currentTest.err.stack
                        .split("\n")
                        .map(line => indent + line)
                        .join("\n")
                )
            }
        });
    });
});
