/*
 * Step definitions for Selenium/browser related steps
 */

/* @flow */

"use strict";

import assert from '../support/page-assertions';
import Url from 'url';
import Yadda from 'yadda';
import { By } from 'selenium-webdriver';

import unpromisify from '../support/yadda-promise';
import { gotoUrl } from '../support/webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', unpromisify(visitUrl))
        .when('I click on "$STRING"', unpromisify(clickLink))
        .then('I should be at $URL', unpromisify(checkURL))
        .then('I should see "$STRING"', unpromisify(thenISee));
})();

async function visitUrl(url: string): Promise {
    await gotoUrl(this.driver, url);
}

async function clickLink(link: string): Promise {
    var element = await this.driver.findElement(By.xpath(
        /* any 'a' element who has a descendent text node containing
         * the link text */
        `//a[normalize-space(.//text()) = normalize-space('${link}')]`
    ));

    await element.click();
}

async function checkURL(expected: string): Promise {
    var browserPath = Url.parse(await this.driver.getCurrentUrl()).path;

    assert.equal(browserPath, expected);
}

async function thenISee(expected: string): Promise {
    await assert.textIsVisible(this.driver, expected);
}
