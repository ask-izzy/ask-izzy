/* @flow */
/*
 * Step definitions for creating a mocked service
 */


import Yadda from "yadda";
import type { LibraryEnglish as YaddaLibraryEnglish } from "yadda";

import dictionary from "../support/dictionary";
import { mock, mockSearch } from "../support/mock_iss/server";
import Service from "../../src/iss/Service";

import { visitUrl } from "./browser";

let mockedService: ?Service;

async function searchMockedService() {
    if (!mockedService) {
        throw new Error("Must set mockedService before visiting a service");
    }
    await visitUrl(this.driver, `/search/${mockedService.id}`);
}

async function visitMockedService() {
    if (!mockedService) {
        throw new Error("Must set mockedService before visiting a service");
    }
    await visitUrl(this.driver, `/service/${mockedService.id}`);
}

async function mockService(service: Service) {
    mockedService = service;
    mock(service);
}

async function mockSearchForServices(
    search: string,
    services: Array<Service>
): Promise<void> {
    mockSearch(search, services);
}

module.exports = ((function(): YaddaLibraryEnglish {
    return Yadda.localisation.English.library(dictionary)
        .given("A service with:\n$service", mockService)
        .when("I navigate to the service page", visitMockedService)
        .when("I search for the service", searchMockedService)
        .given("A search for \"$string\" returns:\n$services",
            mockSearchForServices
        )
    ;
})(): YaddaLibraryEnglish);
