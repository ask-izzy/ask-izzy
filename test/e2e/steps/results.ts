/*
 * Step definitions for search results related steps
 */

import assert from "assert"
import Yadda from "yadda"
import _ from "underscore"

import dictionary from "../support/dictionary"
import { escapeXPathString, matchClass } from "../support/selectors"
import { documentReady, getVisibleTexts, normaliseText, retry } from "../support/world"
import type { StepContext } from "../support/world"

export default Yadda.localisation.English.library(dictionary)
    .when("I wait for $NUMBER results to load", waitForResultCount)
    .then("I should see the results\n$table", async function(this: StepContext, table: Array<Record<string, string>>) {
        await seeTheResultsIn(this, "", table)
    })
    .then("I should see the results for \"$string\"\n$table", async function(
        this: StepContext,
        label: string,
        table: Array<Record<string, string>>,
    ) {
        await seeTheResultsIn(this, label, table)
    })
    .then("I should see a hotline in position $NUM which says \"$STRING\"", hotlinePositionAndText)
    .then("I should see \"$STRING\" before first hotline", assertHotlineHeading)
    .then("my results should not contain\n$table", assertNoSuchResults)
    .then("I should see other services panels after results $STRING", assertOtherServicesPanelPositions)
    .then("the iss search request should be:\n$lines", assertISSSearchRequestFromStep)

async function waitForResultCount(this: StepContext, expected: number): Promise<void> {
    const results = this.world.page.locator(".ResultListItem, .CrisisLineItem")
    await retry(async() => {
        assert.equal(await results.count(), expected)
    }, 10 * 1000)
}

async function seeTheResultsIn(
    stepContext: StepContext,
    label: string,
    table: Array<Record<string, string>>,
): Promise<void> {
    const page = stepContext.world.page
    const keyToClass = (key: string) => key.match(/[(](.*)[)]/)[1]
    const selector = label && `.${label.replace(/ /g, "")}`
    // Normalize the spacing around the dash in both expected and actual values
    const normalizeSpacing = (str: string) => str.replace(/\s*–\s*/g, "–")

    await documentReady(page)

    for (const key of _.keys(table[0])) {
        const expected = _.pluck(table, key)
            .map(normalizeSpacing)
            // '(nada)' represents an empty line
            .filter(text => text !== "(nada)")

        // Results may still be rendering so give them a chance to update
        await retry(async() => {
            const elementsText = await getVisibleTexts(
                page.locator(`${selector} .${keyToClass(key)}`)
            )

            assert.deepStrictEqual(
                elementsText.map(normalizeSpacing),
                expected,
                `${key} is not correct`
            )
        }, 5 * 1000)
    }
}

async function hotlinePositionAndText(
    this: StepContext,
    expectedPos: number,
    expectedText: string,
): Promise<void> {
    const elements = this.world.page.locator(".CrisisLineItem, .ResultListItem")
    const count = await elements.count()

    if (count < expectedPos) {
        throw new Error(
            `Expected crisis line at position ${expectedPos},
             but there were only ${count} lines.`
        )
    }
    const crisisLine = elements.nth(expectedPos - 1)
    assert.equal(await crisisLine.getAttribute("class"), "CrisisLineItem")

    const phone = crisisLine.locator(".Phone .ContactButton").first()
    assert.equal(normaliseText(await phone.innerText()), expectedText)
}

async function assertHotlineHeading(this: StepContext, text: string): Promise<void> {
    const elements = this.world.page.locator(".CrisisLineItem, .CrisisHeader")

    const classes = [
        await elements.nth(0).getAttribute("class"),
        await elements.nth(1).getAttribute("class"),
    ]

    assert.deepStrictEqual(classes, ["CrisisHeader", "CrisisLineItem"])
    assert.equal(normaliseText(await elements.nth(0).innerText()), text)
}

async function assertNoSuchResults(
    this: StepContext,
    table: Array<Record<string, string>>
): Promise<void> {
    // Determine the CSS class for each column
    const getCssClass = (key: string) => key.match(/[(](.*)[)]/)[1]

    for (const row of table) {
        // Build a list of classes and text nodes that should match
        const predicates = _.pairs(row).map(([key, value]) =>
            `.//*[${matchClass(getCssClass(key))} and ` +
            `normalize-space(text()) = ${escapeXPathString(value)}]`
        )

        // Find the ResultListItem that also matches all of these predicates
        const xpath = `//*[${matchClass("ResultListItem")} and ` +
            `${predicates.join(" and ")}]`

        assert.equal(
            await this.world.page.locator(`xpath=${xpath}`).filter({visible: true}).count(),
            0,
            `Found a result matching ${JSON.stringify(row)}`
        )
    }
}

async function assertISSSearchRequestFromStep(
    this: StepContext,
    requestStringAsLines: Array<string>
): Promise<void> {
    const expectedRequest = JSON.parse(requestStringAsLines.join(""))
    const actualRequest = await retry(async() => {
        const query = await this.world.page.evaluate(() => window.issQuery)
        if (!query) {
            throw new Error("Timed out waiting for query to load")
        }
        return query
    }, 5 * 1000)
    assert.deepStrictEqual(actualRequest, expectedRequest)
}

/*
 * Check where the "Other services you may be interested in" panels sit by
 * counting how many results come before each one. Expects a comma separated
 * list of counts, eg "5, 10".
 */
async function assertOtherServicesPanelPositions(
    this: StepContext,
    expectedPositions: string,
): Promise<void> {
    const expected = expectedPositions
        .split(",")
        .map(position => Number(position.trim()))

    await retry(async() => {
        const actual = await this.world.page.evaluate(() => {
            const results = [...document.querySelectorAll(".ResultListItem")]
            return [...document.querySelectorAll(".OtherServicesPanel")]
                .map(panel => results.filter(result =>
                    result.compareDocumentPosition(panel) &
                        Node.DOCUMENT_POSITION_FOLLOWING
                ).length)
        })
        assert.deepStrictEqual(actual, expected)
    }, 5 * 1000)
}
