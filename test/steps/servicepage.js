/* eslint-disable no-use-before-define */

import assert from "assert";
import Yadda from "yadda";
import { By } from "selenium-webdriver";

import dictionary from "../support/dictionary.js";
import asyncFilter from "../support/async-filter.js";

module.exports = ((function() {
    return Yadda.localisation.English.library(dictionary)
        .then("I should see the contacts\n$lines", checkPhoneNumbers)
        .then("I should see a transport time of \"$string\"",
            checkTransportTime
        )
        .then("I should see a transport time of\n$lines",
            checkTransportTimeLines
        )
        .then("I should not see transport times", checkTransportTimesDontExist)
        .then("I should see ATSI flags", seeAtsiFlags)
        .then("I should not see ATSI flags", notSeeAtsiFlags)
})());

async function seeAtsiFlags() {
    let exists = await this.driver.findElement(
        By.css(".IndigenousServiceIcon")
    ).isDisplayed();

    assert.equal(exists, true);
}

async function notSeeAtsiFlags() {
    let exists = await this.driver.findElements(By.css(
        ".IndigenousServiceIcon"
    )).length > 0;

    assert.equal(exists, false);
}

async function checkTransportTimeLines(time) {
    await checkTransportTime.apply(this, [time.join("\n")]);
}

async function checkTransportTime(time) {
    const times = await await getTransportTimes(this.driver)

    assert(
        times.includes(time),
        `Expected '${times}' to include '${time}'`
    );
}

async function checkTransportTimesDontExist() {
    const times = await await getTransportTimes(this.driver)

    assert(
        times.length === 0,
        `Expected there to be no travel times but found '${times}'`
    );
}

async function getTransportTimes(driver) {
    const allTransports = await driver.findElements(
        By.css(".TransportTime")
    )

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

async function checkPhoneNumbers(lines) {
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
