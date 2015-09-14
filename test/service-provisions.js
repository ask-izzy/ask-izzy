/**
 * Test service provisions
 */

/* @flow */

"use strict";

import assert from 'assert';
import fs from 'fs';
import yaml from 'js-yaml';

import serviceProvisions from '../src/constants/service-provisions';

// import the test cases
var tests = yaml.safeLoad(
    fs.readFileSync('./test/service-provisions.yaml', 'utf8')
);

describe("Service Provisions", function() {
    tests.tests.forEach(
        test => it(test.description, () => {
            var provides = [
                /*::`*/
                for (provision of serviceProvisions)
                if (provision.match(test.description))
                provision.name
                /*::`*/
            ];

            assert.deepEqual(provides, test.provides);
        }));
});
