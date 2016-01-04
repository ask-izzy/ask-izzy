/* @flow */
/*
 * Step definitions for branding / design related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";

import unpromisify from "../support/yadda-promise";
import dictionary from "../support/dictionary";
import assert from "../support/page-assertions";
import { within } from "../support/selectors";

module.exports = (function() {
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
        );

})();

async function seeTheBrandingHeader(): Promise<void> {
    const container = within(
        "//*[@class='branding-container']"
    );

    await assert.svgIsVisible(this.driver, "Ask Izzy", container);
    await assert.textIsVisible(
        this.driver,
        "The A to Z directory of homeless help",
        container
    );
}

async function seeTheSearchBar(): Promise<void> {
    const container = within(
        "//*[@class='HeaderBar']"
    );

    await assert.textIsVisible(
        this.driver,
        "What do you need?",
        container
    );
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

    await assert.textIsVisible(
        this.driver,
        "About Ask Izzy",
        container
    );
}
