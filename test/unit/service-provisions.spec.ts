/**
 * Test service provisions
 */

/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";
import fs from "fs";
import yaml from "js-yaml";

import serviceProvisions from "../../src/constants/service-provisions";

// import the test cases
const tests = yaml.safeLoad(
    fs.readFileSync("./test/unit/service-provisions.yaml", "utf8")
);

test.describe("Service Provisions", function() {
    tests.tests.forEach(testCase =>
        test(testCase.description, (): void => {
            let provides = serviceProvisions
                .filter((provision) => provision.match(testCase.description))
                .map(({name}) => name)

            assert.deepStrictEqual(provides, testCase.provides);
        })
    );
});
