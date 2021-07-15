/* $FlowIgnore */
/*
 * Step definitions for Selenium/browser related steps
 */

/* eslint-disable no-use-before-define */

import assert from "../support/page-assertions";
import Yadda from "yadda";
import Webdriver, { By, Key } from "selenium-webdriver";
import {
    TargetLocator,
    Navigation,
} from "selenium-webdriver/lib/webdriver";
import _ from "underscore";

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import pauseToDebug, * as debug from "../support/debug";
import {
    elementWithText,
    elementWithChildText,
    escapeXPathString,
} from "../support/selectors";
import {
    gotoUrl,
    baseUrl,
    cleanDriverSession,
    isElementPresent,
} from "../support/webdriver";
import { regexEscape } from "../../src/utils/strings"

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("a fresh session", unpromisify(cleanSession))
        .given("I open a new browser", unpromisify(newBrowser))
        .when("I visit $URL", unpromisify(visitUrl))
        .when("I click on \"$STRING\"", unpromisify(clickLink))
        .when("I search for \"$STRING\"", unpromisify(doSearch))
        .when("I search for \"$STRING\" and press enter",
            unpromisify(doSearchAndEnter))
        .when("I click on the search button", unpromisify(clickSearch))
        .when("I click back from the title bar", unpromisify(clickBack))
        .when(
            "I click back from the browser UI",
            unpromisify(clickBrowserBack),
        )
        .when(
            "I click on a collapsible section titled \"$STRING\"",
            unpromisify(clickDetails)
        )
        .when("I reload the page", unpromisify(reloadPage))
        .when("I pause for debugging", unpromisify(pauseToDebug))
        .when("I scroll to element \"$STRING\"", unpromisify(scrollToElement))
        .when("I take a screenshot", unpromisify(takeScreenshot))
        .then("I should be at $URL", unpromisify(checkURL))
        .then("I should see \"$STRING\"", unpromisify(thenISee))
        .then("I should see\n$STRING", unpromisify(thenISee))
        .then("I should not see \"$STRING\"", unpromisify(thenIDontSee))
        .then("search box should contain \"$STRING\"",
            unpromisify(searchContains))
        .then("the button \"$STRING\" should be disabled",
            unpromisify(checkDisabled))
        .then("the button \"$STRING\" should be enabled",
            unpromisify(checkEnabled))
        .then("\"$STRING\" should be checked", unpromisify(assertItemChecked))
        .then("\"$STRING\" should not be checked",
            unpromisify(assertItemNotChecked))
        .then("the canonical meta is $URL", unpromisify(checkMetaCanonical))
        .then("I should see the alerts\n$table",
            unpromisify(seeTheAlerts))
    ;
})();

/**
 * Wait for the document to be ready (including completing any AJAX requests).
 *
 * @param {Webdriver.WebDriver} driver - Selenium webdriver.
 * @returns {Promise<boolean>} true if the document is readyState is complete.
 */
module.exports.documentReady = function documentReady(
    driver: Webdriver.WebDriver
): Promise<boolean> {
    return driver.executeScript(() =>
        (document.readyState === "complete") &&
        (window.xhrCount) &&
        (window.xhrCount() === 0)
    );
};

async function visitUrl(url: string): Promise<void> {
    await module.exports.visitUrl(this.driver, url);
}

module.exports.visitUrl = async function visitUrl(
    driver: Webdriver.WebDriver,
    url: string
): Promise<void> {
    await gotoUrl(driver, url);
    await module.exports.documentReady(driver);
}

/**
 * Click a link or button with the text @link.
 *
 * @param {string} link - link text to click on.
 * @returns {Promise} a promise that resolves when the link is identified and
 * clicked.
 */
async function clickLink(link: string): Promise<void> {
    /* any 'a' element who has a descendent text node
     * containing the link text */
    const locator = By.xpath(
        ["a", "button", "label"]
            .map(tag => elementWithChildText(tag, link))
            .join("|")
    );

    let lookingForAttempt = 1;
    while (!await isElementPresent(this.driver, locator)) {
        lookingForAttempt++
        if (this.mochaState.test.timedOut) {
            return
        }
        this.log.push(
            `Couldn't find "${link}" link - attempt ${lookingForAttempt}`
        );
    }
    await this.driver.findElement(locator).click();
    await module.exports.documentReady(this.driver);
}

function navigator(
    driver: Webdriver.WebDriver
): Navigation {
    return new Navigation(driver);
}

async function reloadPage(): Promise<void> {
    await navigator(this.driver).refresh();
    await module.exports.documentReady(this.driver);
}

async function clickBrowserBack(): Promise<void> {
    await navigator(this.driver).back();
    await module.exports.documentReady(this.driver);
}

async function clickBack(): Promise<void> {
    await this.driver.findElement(By.css(
        "button.BackButton"
    ))
        .click();
    await module.exports.documentReady(this.driver);
}

async function urlIs(
    driver: Webdriver.WebDriver,
    expected: string
): Promise<boolean> {
    let url = await driver.getCurrentUrl();

    if (url.endsWith("#")) {
        url = url.slice(0, -1);
    }

    if (expected.startsWith("/")) {
        expected = baseUrl() + expected;
    }

    return decodeURIComponent(url || "") === expected;
}

async function checkURL(expected: string): Promise<void> {
    if (expected.startsWith(`"`)) {
        throw new Error("URL should not be quoted");
    }

    if (expected.startsWith("/")) {
        expected = baseUrl() + expected;
    }

    await this.driver.wait(
        urlIs(this.driver, expected),
        10000,
        `URL should be ${
            expected
        }, was ${
            decodeURIComponent(await this.driver.getCurrentUrl())
        }`,
    );

    let url = await this.driver.getCurrentUrl();

    if (url.endsWith("#")) {
        url = url.slice(0, -1);
    }

    assert.equal(
        decodeURIComponent(url),
        expected
    );
}

async function thenISee(expected: string): Promise<void> {
    await assert.withRetries(assert.textIsVisible)(this.driver, expected);
}

async function thenIDontSee(expected: string): Promise<void> {
    this.mochaState.slow(22000)
    try {
        await assert.textIsVisible(this.driver, expected);
    } catch (error) {
        return;
    }

    throw new Error("Text was seen!");
}

/**
 * Get a search element.
 *
 * @param {Webdriver.WebDriver} driver - Selenium webdriver.
 * @returns {Promise<Webdriver.WebElement>} the search element.
 */
function getSearchElement(
    driver: Webdriver.WebDriver,
): Promise<Webdriver.WebElement> {
    return getInputElement(driver, "search");
}

/**
 * Get a input element.
 *
 * @param {Webdriver.WebDriver} driver - Selenium webdriver.
 * @param {string} type - Element type
 * @returns {Promise<Webdriver.WebElement>} the input element.
 */
function getInputElement(
    driver: Webdriver.WebDriver,
    type = "text",
): Promise<Webdriver.WebElement> {
    return driver.findElement(By.css(
        `input[type=${type}]`
    ));
}

async function doSearch(search: string): Promise<void> {
    let element = await getSearchElement(this.driver);

    await element.clear();
    await element.sendKeys(search);

    await module.exports.documentReady(this.driver);
}

async function doSearchAndEnter(search: string): Promise<void> {
    await (await getSearchElement(this.driver))
        .sendKeys(search + Key.ENTER);
    await module.exports.documentReady(this.driver);
}

async function searchContains(expected: string): Promise<void> {
    let value = await (await getSearchElement(this.driver))
        .getAttribute("value");

    assert.equal(value, expected);
}

async function clickSearch(): Promise<void> {
    await this.driver.findElement(By.css(".search button"))
        .click();
}


async function clickDetails(title: string): Promise<void> {
    await module.exports.documentReady(this.driver);

    const element = await this.driver.findElement(By.xpath(
        `//details/summary/descendant-or-self::*[
            normalize-space(.) = normalize-space(${escapeXPathString(title)})
        ]`
    ))

    await element.click();
}

async function getButtonState(
    driver: Webdriver.WebDriver,
    text: string,
): Promise<boolean> {
    return await driver
        .findElement(By.xpath(elementWithText("button", text)))
        .isEnabled();
}

async function checkDisabled(text: string): Promise<void> {
    let enabled = await getButtonState(this.driver, text);

    assert.equal(enabled, false);
}

async function checkEnabled(text: string): Promise<void> {
    let enabled = await getButtonState(this.driver, text);

    assert.equal(enabled, true);
}

async function assertItemCheckedIs(
    label: string,
    status: any
): Promise<void> {
    let labelXPath = `//a[.//*[text()=${escapeXPathString(label)}]]`;

    let checked = await this.driver.findElement(By.xpath(
        `${labelXPath}//input`
    ))
        .getAttribute("checked");

    assert.equal(checked, status);
}

async function assertItemChecked(label: string): Promise<void> {
    await assertItemCheckedIs.bind(this)(label, "true");
}

async function assertItemNotChecked(label: string): Promise<void> {
    await assertItemCheckedIs.bind(this)(label, null);
}

async function checkMetaCanonical(expected: string): Promise<void> {

    let content = await this.driver.findElement(By.css(
        "link[rel=canonical]"
    ))
        .getAttribute("content");

    content = decodeURIComponent(content);

    content = content.replace(/^.*\/\/[^/]+/, "");

    assert.equal(
        content,
        expected
    );
}

/**
 * Switch to a new tab in the current driver
 *
 * @returns {Promise<void>} resolves after we've switched to the new tab.
 *
 */
async function newBrowser(): Promise<void> {
    const currentHandle = await this.driver.getWindowHandle();

    await this.driver.executeScript(() => {
        document.body.innerHTML = `<a
            href="about:blank"
            target="_blank"
        >
            Click Here
        </a>`;
    });
    await clickLink.apply(this, ["Click Here"]);
    const newHandles = _(await this.driver.getAllWindowHandles())
        .without(currentHandle);

    if (newHandles.length != 1) {
        throw new Error(
            `Expected opening a new tab to result in 1 window, got ${
                newHandles.length
            }.`
        );
    }

    await new TargetLocator(this.driver)
        .window(newHandles[0]);
}

async function cleanSession(): Promise<void> {
    await cleanDriverSession(this.driver);
}

async function takeScreenshot(): Promise<void> {
    const filepath = await debug.takeScreenshot(
        this.driver,
        debug.getSceenshotPath(this.mochaState.currentTest)
    )

    console.log(`${this.indent}  Screenshot saved to "${filepath}"`);
}

/**
 * Scroll element into view.
 *
 * @param {string} elementSelector - selector to find element.
 * @returns {Promise} a promise that resolves when the link is scrolled to.
 */
async function scrollToElement(elementSelector: string): Promise<void> {
    return driver.executeScript(() =>
        document.querySelector(elementSelector).scrollIntoView()
    );
}

async function seeTheAlerts(
    table: Array<Object>,
): Promise<void> {
    await this.driver.wait(module.exports.documentReady(this.driver), 10000);

    const alertElements = await this.driver.findElements(
        By.css(`.AlertBannerList .AlertBanner`)
    )
    assert.strictEqual(
        alertElements.length,
        table.length,
        "The number of actual alerts and expected alerts differ."
    )
    for (const [index, row] of table.entries()) {
        const alertElement = alertElements[index]
        const titleElementText = await alertElement.findElement(
            By.css(`.title-container`)
        ).getText()

        let bodyElementText = ""
        const timeouts = await this.driver.manage().getTimeouts()
        try {
            await this.driver.manage().setTimeouts({implicit: 0})
            bodyElementText = await alertElement.findElement(
                By.css(`.body`)
            ).getText()
        } catch (error) {
            // body is optional in some alerts so might not matter if we
            // don't find it
        } finally {
            await this.driver.manage().setTimeouts(
                {implicit: timeouts.implicit}
            )
        }

        const textMatchesGlob = (text, glob) => {
            assert.match(
                text,
                new RegExp(
                    "^" + regexEscape(glob).replace("\\*", "[\\s\\S]*") + "$"
                )
            )
        }

        textMatchesGlob(titleElementText, row.Title)
        textMatchesGlob(bodyElementText, row.Body)
    }
}
