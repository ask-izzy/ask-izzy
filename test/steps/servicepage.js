/* @flow */
/* eslint-disable no-use-before-define */

import assert from "assert";
import Yadda from "yadda";
import type { LibraryEnglish as YaddaLibraryEnglish } from "yadda"
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import asyncFilter from "../support/async-filter";

module.exports = ((function(): YaddaLibraryEnglish {
    return Yadda.localisation.English.library(dictionary)
        .then("I should see the contacts\n$lines",
            unpromisify(checkPhoneNumbers))
        .then("I should see a transport time of \"$string\"",
            unpromisify(checkTransportTime))
        .then("I should see a transport time of\n$lines",
            unpromisify(checkTransportTimeLines))
        .then("I should see ATSI flags",
            unpromisify(seeAtsiFlags))
        .then("I should not see ATSI flags",
            unpromisify(notSeeAtsiFlags))
    ;
})(): YaddaLibraryEnglish);

async function seeAtsiFlags(): Promise<void> {
    let exists = await this.driver.findElement(
        By.css(".IndigenousServiceIcon")
    ).isDisplayed();

    assert.equal(exists, true);
}

async function notSeeAtsiFlags(): Promise<void> {

    let exists = await this.driver.findElements(By.css(
        ".IndigenousServiceIcon"
    )).length > 0;

    assert.equal(exists, false);
}

async function checkTransportTimeLines(time: Array<string>): Promise<void> {
    await checkTransportTime.apply(this, [time.join("\n")]);
}

async function checkTransportTime(time: string): Promise<void> {
    let allTransports = await this.driver.findElements(
        By.css(".TransportTime")
    );
    let visibleTransports = await asyncFilter(
        allTransports,
        elem => elem.isDisplayed()
    );
    let text = await Promise.all(visibleTransports.map(
        elem => elem.getText()
    ))

    text = normalizeWhitespace(text.join("\n"))
    assert(text.indexOf(normalizeWhitespace(time)) !== -1,
        `Expected '${text}' to include '${time}'`);
}

function normalizeWhitespace(text: string, resultingSpace = "\n"): string {
    return text.replace(/\s+/g, resultingSpace)
}

async function checkPhoneNumbers(lines: Array<string>): Promise<void> {
    let phoneElems = await this.driver.findElements(By.css(".Contact"));
    let visiblePhoneElems = await asyncFilter(
        phoneElems,
        elem => elem.isDisplayed()
    );
    let text = await Promise.all(visiblePhoneElems.map(
        elem => elem.getText()
    ));

    assert.deepEqual(text.map(
        (string) => string.replace("\n", " ")
    ), lines);
}
