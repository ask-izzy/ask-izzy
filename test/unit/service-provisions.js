/* @flow */
/**
 * Test service provisions
 */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";
import fs from "fs";
import yaml from "js-yaml";

import serviceProvisions from "../../src/constants/service-provisions";

// import the test cases
const tests = yaml.safeLoad(
    fs.readFileSync("./test/unit/service-provisions.yaml", "utf8")
);

describe("Service Provisions", function() {
    tests.tests.forEach(test =>
        it(test.description, (): void => {
            let provides = serviceProvisions
                .filter((provision) => provision.match(test.description))
                .map(({name}) => name)

            assert.deepStrictEqual(provides, test.provides);
        })
    );
});
