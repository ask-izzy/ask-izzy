/*
 * Step definitions for creating a mocked service
 */


import Yadda from "yadda";
import fetch from "node-fetch";

import { visitUrl } from "../steps/browser";
import dictionary from "../support/dictionary";

let mockedService;

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

async function mockService(service) {
    mockedService = service;
    const res = await fetch(`${process.env.NEXT_PUBLIC_ISS_BASE_URL}/mock/service`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
    })
    if (res.status < 200 || res.status > 299) {
        throw Error("Could not mock service")
    }
}

async function mockSearchForServices(
    search,
    services
) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ISS_BASE_URL}/mock/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({search, services}),
    })
    if (res.status < 200 || res.status > 299) {
        throw Error("Could not mock search")
    }
}

module.exports = ((function() {
    return Yadda.localisation.English.library(dictionary)
        .given("A service with:\n$service", mockService)
        .when("I navigate to the service page", visitMockedService)
        .when("I search for the service", searchMockedService)
        .given("A search for \"$string\" returns:\n$services",
            mockSearchForServices
        )
    ;
})());
