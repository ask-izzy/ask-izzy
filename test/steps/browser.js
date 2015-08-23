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
        .then('I should see "$STRING"', unpromisify(thenISee))
        .then('search box should contain "$STRING"',
              unpromisify(searchContains));
})();

async function visitUrl(url: string): Promise {
    await gotoUrl(this.driver, url);
}

/**
 * clickLink:
 *
 * Click a link or button with the text @link.
 *
 * Returns: a promise that resolves when the link is identified and
 * clicked.
 */
async function clickLink(link: string): Promise {
    var element = await this.driver.findElement(By.xpath(
        /* any 'a' element who has a descendent text node containing
         * the link text */
        ['a', 'button'].map(tag =>
        `//${tag}
           [normalize-space(.//text()) = normalize-space('${link}')]`
                           ).join('|')
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

async function searchContains(expected: string): Promise {
    var element = await this.driver.findElement(By.css(
        'input[type=search]'
    ));

    var value = await element.getAttribute('value');

    assert.equal(value, expected);
}
