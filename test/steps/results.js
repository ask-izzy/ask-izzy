/* @flow */
/* eslint-disable no-use-before-define */

import assert from "assert";
import Yadda from "yadda";
import _ from "underscore";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { documentReady } from "./browser";
import { matchClass, escapeXPathString } from "../support/selectors";
import asyncFilter from "../support/async-filter";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .then("I should see the results\n$table",
              unpromisify(seeTheResults))
        .then('I should see a hotline in position $NUM which says "$STRING"',
              unpromisify(hotlinePositionAndText))
        .then('I should see "$STRING" before first hotline',
              unpromisify(assertHotlineHeading))
        .then("my results should not contain\n$table",
              unpromisify(assertNoSuchResults))
        ;
})();

async function seeTheResults(table: Array<Object>): Promise<void> {
    await this.driver.wait(documentReady(this.driver), 10000);

    const getText = element => element.getText();

    for (let key of _.keys(table[0])) {
        let class_ = key.match(/[(](.*)[)]/)[1];

        let expected = _.pluck(table, key);
        let actual = await Promise.all(
            (
                await this.driver.findElements(By.css(`.ScreenOnly .${class_}`))
            ).map(getText)
        );

        // replace '(nada)' with an empty string (to represent
        // an empty line)
        expected = expected.map(text => text == "(nada)" ? "" : text);

        assert.deepEqual(actual, expected,
                         `${key} is not correct`);
    }
}

async function hotlinePositionAndText(
    expectedPos: number,
    expectedText: string,
): Promise<void> {
    let elements = await this.driver.findElements(
            By.css(".CrisisLineItem, .ResultListItem, .Infobox")
        );
    let crisisLine = elements[expectedPos - 1];

    if (!crisisLine) {
        throw new Error(
            `Expected crisis line at position ${expectedPos},
             but there were only ${elements.length} lines.`
        );
    }
    assert.equal(await crisisLine.getAttribute("class"),
                 "CrisisLineItem");

    let phone = await crisisLine.findElement(By.css(".Phone"));

    assert.equal(await phone.getText(), expectedText);
}

async function assertHotlineHeading(text: string): Promise<void> {
    let elements = await this.driver.findElements(
        By.css(".CrisisLineItem, .CrisisHeader")
    );

    let classes = [
        await elements[0].getAttribute("class"),
        await elements[1].getAttribute("class"),
    ];

    assert.deepEqual(classes, ["CrisisHeader", "CrisisLineItem"]);
    assert.equal(await elements[0].getText(), text);
}

async function assertNoSuchResults(table: Array<Object>): Promise<void> {
    // Determine the CSS class for each column
    const getCssClass = key => key.match(/[(](.*)[)]/)[1];
    let elements = [];

    for (let row of table) {
        // Build a list of classes and text nodes that should match
        const predicates = [
            /*::`*/
            for ([key, value] of _.pairs(row))
            /*::`, function(key, value){*/
            `.//*[${matchClass(getCssClass(key))} and ` +
            `normalize-space(text()) = ${escapeXPathString(value)}]`
            /*::}*/
        ];

        // Find the ResultListItem that also matches all of these predicates
        const xpath = `//*[${matchClass("ResultListItem")} and ` +
            `${predicates.join(" and ")}]`;

        elements = elements.concat(
            await this.driver.findElements(By.xpath(xpath))
        );
    }

    // Limit to visible elements on the screen
    let elementsHtml = await asyncFilter(
        elements,
        (element) => element.isDisplayed(),
    );

    assert.deepEqual(elementsHtml, []);
}
