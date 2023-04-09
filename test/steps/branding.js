/*
 * Step definitions for branding / design related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary.js";
import assert from "../support/page-assertions.js";
import { matchClass } from "../support/selectors.js";



module.exports = ((function() {
    return Yadda.localisation.English.library(dictionary)
        .then("I should see the branding header", seeTheBrandingHeader)
        .then("I should see the search bar", seeTheSearchBar)
        .then("I should see the list of categories\n$lines", seeTheCategoryList)
        .then("I should see the branding footer", seeTheBrandingFooter)
})());

async function seeTheBrandingHeader() {
    await assert.textIsVisible(
        this.driver,
        "Find the help you need, now and nearby."
    );
}

async function seeTheSearchBar() {
    // XPath doesn't have a great way of checking for a single class, only a
    // full class string. So we have to do an ugly workaround.
    const searchBarXPath =
        `//*[${matchClass("SearchBar")}]//input[@type='search']`

    try {
        await assert.isElementPresent(
            this.driver,
            By.xpath(searchBarXPath)
        );
    } catch (error) {
        throw new Error(`Could not find search bar using "${searchBarXPath}"`)
    }

}

async function seeTheCategoryList(
    categories,
) {
    for (let idx = 0; idx < categories.length; idx++) {
        await assert.textIsVisible(
            this.driver,
            categories[idx]
        );
    }
}

async function seeTheBrandingFooter() {
    await assert.textIsVisible(
        this.driver,
        "About Ask Izzy"
    );
}
