/* @flow */
/* eslint-disable no-use-before-define */

import assert from "assert";
import Yadda from "yadda";
import type { LibraryEnglish as YaddaLibraryEnglish } from "yadda"
import Webdriver, { By } from "selenium-webdriver";

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
        .then("I should not see transport times",
            unpromisify(checkTransportTimesDontExist))
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
    const times = await await getTransportTimes(this.driver)

    assert(
        times.includes(time),
        `Expected '${times}' to include '${time}'`
    );
}

async function checkTransportTimesDontExist(): Promise<void> {
    const times = await await getTransportTimes(this.driver)

    assert(
        times.length === 0,
        `Expected there to be no travel times but found '${times}'`
    );
}

async function getTransportTimes(
    driver: typeof Webdriver.WebDriver
): Promise<Array<string>> {
    const allTransports = await driver.findElements(
        By.css(".TransportTime")
    )

    // $FlowIgnore needed because WebDriver is not typed
    const visibleTransportElements = await asyncFilter(
        allTransports,
        elem => elem.isDisplayed()
    )

    const visibleTransportText = await Promise.all(
        visibleTransportElements.map(
            elem => elem.getText().then(
                text => text.split("\n")
            )
        )
    )

    return visibleTransportText.flat()
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
        (string) => string.replace(/\n/g, " ")
    ), lines);
}
