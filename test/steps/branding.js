/* @flow */
/*
 * Step definitions for branding / design related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import type { LibraryEnglish as YaddaLibraryEnglish } from "yadda"

import unpromisify from "../support/yadda-promise";
import dictionary from "../support/dictionary";
import assert from "../support/page-assertions";
import { within } from "../support/selectors";
import { By } from "selenium-webdriver";

module.exports = ((function(): YaddaLibraryEnglish {
    return Yadda.localisation.English.library(dictionary)

        .then(
            "I should see the branding header",
            unpromisify(seeTheBrandingHeader)
        )

        .then(
            "I should see the search bar",
            unpromisify(seeTheSearchBar)
        )

        .then(
            "I should see the list of categories\n$lines",
            unpromisify(seeTheCategoryList)
        )

        .then(
            "I should see the branding footer",
            unpromisify(seeTheBrandingFooter)
        )

        .then(
            "within the footer I should see \"$text\"",
            unpromisify(seeTextInBrandingFooter)
        );

})(): YaddaLibraryEnglish);

async function seeTheBrandingHeader(): Promise<void> {
    const container = within(
        "//*[@class='branding-container']"
    );

    await assert.textIsVisible(
        this.driver,
        "Ask Izzy:\nFind the help you need, now and nearby.",
        container
    );
}

async function seeTheSearchBar(): Promise<void> {
    // XPath doesn't have a great way of checking for a single class, only a
    // full class string. So we have to do an ugly workaround.
    const searchBarXPath =
        "//*[contains(concat(' ',normalize-space(@class),' '),' SearchBar ')]" +
        "//input[@type='search']"

    try {
        await assert.isElementPresent(
            this.driver,
            By.xpath(searchBarXPath)
        );
    } catch (error) {
        throw new Error(`Could not find search bar using "${searchBarXPath}"`)
    }

}

// The errors from this are really obtuse
// if you get the order of the categories list wrong.
// Would be better to find the element then assert its position
// but selenium doesn't give me much to work with.
async function seeTheCategoryList(
    categories: Array<string>,
): Promise<void> {
    for (let idx = 0; idx < categories.length; idx++) {
        let container = within(
            `//*[@class='List categories']/div[position()=${idx + 1}]`
        );

        // FIXME: textIsVisible doesn't have a 3rd argument
        await assert.textIsVisible(
            this.driver,
            categories[idx],
            container
        );
    }
}

async function seeTheBrandingFooter(): Promise<void> {
    const container = within(
        "//footer"
    );

    // FIXME: textIsVisible doesn't have a 3rd argument
    await assert.textIsVisible(
        this.driver,
        "About Ask Izzy",
        container
    );
}

async function seeTextInBrandingFooter(text: string): Promise<void> {
    const container = within(
        "//footer"
    );

    // FIXME: textIsVisible doesn't have a 3rd argument
    await assert.textIsVisible(
        this.driver,
        text,
        container
    );
}
