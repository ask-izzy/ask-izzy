/*
 * Step definitions for the service page
 */

import assert from "assert"
import Yadda from "yadda"
import type { Page } from "@playwright/test"

import dictionary from "../support/dictionary"
import { getVisibleTexts, retry } from "../support/world"
import type { StepContext } from "../support/world"

export default Yadda.localisation.English.library(dictionary)
    .then("I should see the contacts\n$lines", checkPhoneNumbers)
    .then("I should see a transport time of \"$string\"", async function(this: StepContext, time: string) {
        await checkTransportTime(this.world.page, time)
    })
    .then("I should see a transport time of\n$lines", async function(this: StepContext, time: Array<string>) {
        await checkTransportTime(this.world.page, time.join("\n"))
    })
    .then("I should not see transport times", async function(this: StepContext) {
        const times = await getTransportTimes(this.world.page)
        assert(
            times.length === 0,
            `Expected there to be no travel times but found '${times}'`
        )
    })
    .then("I should see ATSI flags", async function(this: StepContext) {
        await this.world.page
            .locator(".IndigenousServiceIcon")
            .first()
            .waitFor({timeout: 10 * 1000})
    })
    .then("I should not see ATSI flags", async function(this: StepContext) {
        assert.equal(
            await this.world.page.locator(".IndigenousServiceIcon").count(),
            0
        )
    })

async function getTransportTimes(page: Page): Promise<Array<string>> {
    const texts = await getVisibleTexts(page.locator(".TransportTime"))

    return texts.flatMap(text => text.split("\n"))
}

async function checkTransportTime(page: Page, time: string): Promise<void> {
    await retry(async() => {
        const times = await getTransportTimes(page)
        assert(
            times.includes(time),
            `Expected '${times}' to include '${time}'`
        )
    }, 5 * 1000)
}

async function checkPhoneNumbers(this: StepContext, lines: Array<string>): Promise<void> {
    // The contacts may be re-rendered while we're reading them so keep trying
    // until they match or we time out
    await retry(async() => {
        const text = await getVisibleTexts(this.world.page.locator(".Contact"))
        assert.deepStrictEqual(
            text.map(string => string.replace(/\n/g, " ")),
            lines
        )
    }, 5 * 1000)
}
