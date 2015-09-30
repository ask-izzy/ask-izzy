/* @flow */
/*
 * Step definitions for creating a mocked service
 */


import Yadda from "yadda";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from "../support/webdriver";

import { mock } from "../support/mock_iss/server";

var mockedService: ?Service;

async function visitMockedService(url: string): Promise {
    await gotoUrl(this.driver, `/service/${mockedService.id}`);
}

async function mockService(service: Service): Promise<void> {
    mockedService = service;
    mock(service);
}

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("A service with:\n$service",
            unpromisify(mockService))
        .when("I navigate to the service page",
            unpromisify(visitMockedService))
        ;
})();
