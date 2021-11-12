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
import pauseToDebug, * as debug from "../support/debug";
import {
    elementWithText,
    escapeXPathString,
} from "../support/selectors";
import {
    getElementWithText,
    getElementWithTextSubstring,
} from "../support/elements"
import {
    gotoUrl,
    baseUrl,
    cleanDriverSession,
} from "../support/webdriver";
import { regexEscape } from "../../src/utils/strings"

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("a fresh session", cleanSession)
        .given("I open a new browser", newBrowser)
        .when("I visit $URL", visitUrl)
        .when("I click the \"$STRING\" link", clickLink)
        .when("I click the link with \"$STRING\" substring",
            clickLinkWithSubstring
        )
        .when("I click the \"$STRING\" button", clickButton)
        .when("I click the \"$STRING\" dropdown", clickDropdown)
        .when("I click the \"$STRING\" dropdown option", clickDropdownOption)
        .when("I click the \"$STRING\" collapsible section", clickDetails)
        .when("I search for \"$STRING\"", doSearch)
        .when("I search for \"$STRING\" and press enter", doSearchAndEnter)
        .when("I click home from the title bar", clickHome)
        .when("I click back from the title bar", clickBack)
        .when("I click back from the browser UI", clickBrowserBack)
        .when("I reload the page", reloadPage)
        .when("I wait for page to finish loading", async function() {
            await module.exports.documentReady(this.driver)
        })
        .when("I pause for debugging", pauseToDebug)
        .when("I throw an error", () => {
            throw new Error("Artificial error")
        })
        .when("I scroll to element \"$STRING\"", scrollToElement)
        .when("I take a screenshot", takeScreenshot)
        .then("I should be at $URL", checkURL)
        .then("I should see \"$STRING\"", thenISee)
        .then("I should see\n$STRING", thenISee)
        .then("I should not see \"$STRING\"", thenIDontSee)
        .then("search box should contain \"$STRING\"", searchContains)
        .then("search box should contain \"\"", function() {
            searchContains.call(this, "")
        })
        .then("the button \"$STRING\" should be disabled", checkDisabled)
        .then("the button \"$STRING\" should be enabled", checkEnabled)
        .then("\"$STRING\" should be checked", assertItemChecked)
        .then("\"$STRING\" should not be checked", assertItemNotChecked)
        .then("the canonical meta is $URL", checkMetaCanonical)
        .then("I should see the alerts\n$table", seeTheAlerts)
        .then("I should see the browser tab title of \"$STRING\"",
            seeBrowserTitle
        )
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
    return driver.executeAsyncScript((callback) => {
        const intervalId = setInterval(() => {
            // Internal page
            if (window.location.hostname === "localhost") {
                if (window.waitTillPageLoaded) {
                    clearInterval(intervalId)
                    window.waitTillPageLoaded()
                        .then(() => callback())
                }

            // External page
            } else {
                if (document.readyState === "complete") {
                    clearInterval(intervalId)
                    callback()
                }
            }
        }, 10);
    })
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

async function clickLink(linkText: string) {
    await clickElementWithText(this.driver, linkText, "a")
}

async function clickLinkWithSubstring(linkText: string) {
    await clickElementWithTextSubstring(this.driver, linkText, "a")
}

async function clickButton(buttonText: string) {
    await clickElementWithText(this.driver, buttonText, "button")
}

async function clickDetails(summaryText: string): Promise<void> {
    await clickElementWithText(this.driver, summaryText, "details/summary")
}

async function clickElementWithText(
    driver: Webdriver.WebDriver,
    elementText: string,
    elementType?: string
) {
    const element = await getElementWithText(driver, elementText, elementType)
    await element.click();
    await module.exports.documentReady(driver);
}

async function clickElementWithTextSubstring(
    driver: Webdriver.WebDriver,
    elementText: string,
    elementType?: string
) {
    const element = await getElementWithTextSubstring(
        driver,
        elementText,
        elementType
    )
    await element.click();
    await module.exports.documentReady(driver);
}

async function clickDropdown(optionText: string) {
    await clickElementWithText(
        this.driver,
        optionText,
        "*[self::select or (@role = \"listbox\")]"
    )
}

async function clickDropdownOption(optionText: string) {
    await clickElementWithText(
        this.driver,
        optionText,
        "*[self::select or (@role = \"listbox\")]" +
            "//*[self::option or (@role = \"option\")]"
    )
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

async function clickHome(): Promise<void> {
    await this.driver.findElement(By.css(
        ".appBarLogo"
    ))
        .click();
    await module.exports.documentReady(this.driver);
}

async function clickBack(): Promise<void> {
    await this.driver.findElement(By.css(
        "button.IconButton"
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
        () => urlIs(this.driver, expected),
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

async function getButtonState(
    driver: Webdriver.WebDriver,
    text: string,
): Promise<boolean> {
    return await driver
        .findElement(By.xpath(elementWithText(text, "button")))
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

    // Clear list of script ids for script that were queue to run on page load
    this.driver.scriptIdsOfScriptsRunBeforeLoad.length = 0

    await new TargetLocator(this.driver)
        .window(newHandles[0]);
}

async function cleanSession(): Promise<void> {
    await cleanDriverSession(this.driver);
}

async function takeScreenshot(): Promise<void> {
    const filepath = await debug.takeScreenshot(
        this.driver,
        debug.getSceenshotPath(
            this.mochaState.currentTest || this.mochaState.test
        )
    )

    console.log(`${this.indent}  Screenshot saved to "${filepath}"`);
}

async function scrollToElement(elementText: string): Promise<void> {
    return this.driver.executeScript(
        (elementXPathSelector, elementText) => {
            const element = document
                .evaluate(
                    elementXPathSelector,
                    document,
                    null,
                    XPathResult.ANY_TYPE
                )
                .iterateNext()
            if (!element) {
                throw Error(`Can't find element with text "${elementText}"`)
            }
            element.scrollIntoView({
                block: "center",
            })
        },
        elementWithText(elementText),
        elementText
    );
}

async function seeBrowserTitle(title: string): Promise<void> {
    const browserTitle = await this.driver.getTitle()

    assert.strictEqual(
        title,
        browserTitle,
        "The actual title differs from the expected title."
    )
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
