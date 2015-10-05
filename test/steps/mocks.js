/* @flow */
/*
 * Step definitions for creating a mocked service
 */


import Yadda from "yadda";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from "../support/webdriver";

import { mock } from "../support/mock_iss/server";
import { Service } from "../../src/iss";

var mockedService: ?Service;

async function searchMockedService() {
    if (!mockedService) {
        throw new Error("Must set mockedService before visiting a service");
    }
    await gotoUrl(this.driver, `/search/${mockedService.id}`);
}

async function visitMockedService() {
    if (!mockedService) {
        throw new Error("Must set mockedService before visiting a service");
    }
    await gotoUrl(this.driver, `/service/${mockedService.id}`);
}

async function mockService(service: Service) {
    mockedService = service;
    mock(service);
}

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("A service with:\n$service",
            unpromisify(mockService))
        .when("I navigate to the service page",
            unpromisify(visitMockedService))
        .when("I search for the service",
            unpromisify(searchMockedService))
        ;
})();
