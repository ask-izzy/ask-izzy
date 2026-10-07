/*
 * Step definitions for branding / design related steps
 */

import Yadda from "yadda"

import dictionary from "../support/dictionary"
import { matchClass } from "../support/selectors"
import { assertTextIsVisible } from "../support/world"
import type { StepContext } from "../support/world"

export default Yadda.localisation.English.library(dictionary)
    .then("I should see the branding header", async function(this: StepContext) {
        await assertTextIsVisible(this.world.page, "Find the help you need, now and nearby.")
    })
    .then("I should see the search bar", seeTheSearchBar)
    .then("I should see the list of categories\n$lines", seeTheCategoryList)
    .then("I should see the branding footer", async function(this: StepContext) {
        await assertTextIsVisible(this.world.page, "About Ask Izzy")
    })

async function seeTheSearchBar(this: StepContext): Promise<void> {
    // XPath doesn't have a great way of checking for a single class, only a
    // full class string. So we have to do an ugly workaround.
    const searchBarXPath =
        `//*[${matchClass("SearchBar")}]//input[@type='search']`

    try {
        await this.world.page
            .locator(`xpath=${searchBarXPath}`)
            .first()
            .waitFor({state: "attached", timeout: 5 * 1000})
    } catch (error) {
        throw new Error(`Could not find search bar using "${searchBarXPath}"`)
    }
}

async function seeTheCategoryList(
    this: StepContext,
    categories: Array<string>,
): Promise<void> {
    for (const category of categories) {
        await assertTextIsVisible(this.world.page, category)
    }
}
