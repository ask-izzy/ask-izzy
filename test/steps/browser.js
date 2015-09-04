/*
 * Step definitions for Selenium/browser related steps
 */

/* @flow */

"use strict";

import assert from '../support/page-assertions';
import Url from 'url';
import Yadda from 'yadda';
import { By, Key } from 'selenium-webdriver';

import unpromisify from '../support/yadda-promise';
import { gotoUrl } from '../support/webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library()
        .when('I visit $URL', unpromisify(visitUrl))
        .when('I click on "$STRING"', unpromisify(clickLink))
        .when('I search for "$STRING"', unpromisify(doSearch))
        .when('I search for "$STRING" and press enter',
              unpromisify(doSearchAndEnter))
        .when('I click on the search icon', unpromisify(clickSearchIcon))
        .when('I click back from the title bar',
              unpromisify(clickBack))
        .when('I pause for debugging', unpromisify(pauseToDebug))
        .then('I should be at $URL', unpromisify(checkURL))
        .then('I should see "$STRING"', unpromisify(thenISee))
        .then('I should not see "$STRING"', unpromisify(thenIDontSee))
        .then('search box should contain "$STRING"',
              unpromisify(searchContains))
        .then('the button "$STRING" should be disabled',
              unpromisify(checkDisabled))
        .then('the button "$STRING" should be enabled',
              unpromisify(checkEnabled));
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
async function clickLink(link: string): Promise<void> {
    await this.driver.findElement(By.xpath(
        /* any 'a' element who has a descendent text node containing
         * the link text */
        ['a', 'button'].map(tag =>
        `//${tag}
           [normalize-space(.//text()) = normalize-space('${link}')]`
                           ).join('|')
    ))
        .click();
}

async function clickBack(): Promise<void> {
    await this.driver.findElement(By.css(
        'button.BackButton'
    ))
        .click();
}

function pauseToDebug() {
    return new Promise((resolve, reject) => {
        console.log("Paused. Press any key to continue...");
        var stdin = process.stdin;

        stdin.setRawMode(true);
        stdin.on('data', (key) => {
            stdin.setRawMode(false);
            if (key === '\u0003') {  // Ctrl-C
                reject();
            } else {
                resolve();
            }
        });
    });
}

async function checkURL(expected: string): Promise<void> {
    var browserPath = Url.parse(await this.driver.getCurrentUrl()).path;

    assert.equal(browserPath, expected);
}

async function thenISee(expected: string): Promise<void> {
    await assert.textIsVisible(this.driver, expected);
}

async function thenIDontSee(expected: string): Promise<void> {
    try {
        await assert.textIsVisible(this.driver, expected);
    } catch (e) {
        return;
    }

    throw new Error("Text was seen!");
}

/**
 * getSearchElement:
 *
 * Get a search element.
 */
function getSearchElement(driver: Webdriver.WebDriver):
    Promise<Webdriver.WebElement>
{
    return driver.findElement(By.css(
        'input[type=search]'
    ));
}

async function doSearch(search: string): Promise<void> {
    var element = await getSearchElement(this.driver);

    await element.clear();
    await element.sendKeys(search);
}

async function doSearchAndEnter(search: string): Promise<void> {
    await getSearchElement(this.driver)
        .sendKeys(search + Key.ENTER);
}

async function searchContains(expected: string): Promise<void> {
    var value = await getSearchElement(this.driver)
        .getAttribute('value');

    assert.equal(value, expected);
}

async function clickSearchIcon(): Promise<void> {
    await this.driver.findElement(By.css('.search .icon'))
        .click();
}

async function getButtonState(driver: Webdriver.WebDriver, text: string):
    Promise<boolean>
{
    return await driver.findElement(By.xpath(
        `//button[normalize-space(.//text()) = normalize-space('${text}')]`
    ))
        .isEnabled();
}

async function checkDisabled(text: string): Promise<void> {
    var enabled = await getButtonState(this.driver, text);

    assert.equal(enabled, false);
}

async function checkEnabled(text: string): Promise<void> {
    var enabled = await getButtonState(this.driver, text);

    assert.equal(enabled, true);
}
