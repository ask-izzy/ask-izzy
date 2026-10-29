/*
 * Step definitions for mocking ISS responses
 */

import Yadda from "yadda"

import dictionary from "../support/dictionary"
import { visitUrl } from "../support/world"
import type { StepContext } from "../support/world"
import type Service from "@/src/iss/Service"

let mockedService: Service | null = null

async function postToMockIss(path: string, body: unknown, errorMessage: string): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ISS_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    if (res.status < 200 || res.status > 299) {
        throw Error(errorMessage)
    }
}

export default Yadda.localisation.English.library(dictionary)
    .given("A service with:\n$service", async(service: Service) => {
        mockedService = service
        await postToMockIss("/mock/service", service, "Could not mock service")
    })
    .when("I navigate to the service page", async function(this: StepContext) {
        if (!mockedService) {
            throw new Error("Must set mockedService before visiting a service")
        }
        await visitUrl(this.world.page, `/service/${mockedService.id}`)
    })
    .when("I search for the service", async function(this: StepContext) {
        if (!mockedService) {
            throw new Error("Must set mockedService before visiting a service")
        }
        await visitUrl(this.world.page, `/search/${mockedService.id}`)
    })
    .given(
        "A search for \"$string\" returns:\n$services",
        async(search: string, services: Array<Service>) => {
            await postToMockIss("/mock/search", {search, services}, "Could not mock search")
        }
    )
