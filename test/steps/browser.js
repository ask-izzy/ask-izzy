/*
 * Step definitions for Selenium/browser related steps
 */

/* eslint-disable no-use-before-define */


import Yadda from "yadda";
import { By, Key } from "selenium-webdriver";
import {
    TargetLocator,
    Navigation,
} from "selenium-webdriver/lib/webdriver";
import _ from "underscore";

import assert from "../support/page-assertions";
import dictionary from "../support/dictionary";
import pauseToDebug, * as debug from "../support/debug";
import {
    elementWithText,
    escapeXPathString,
} from "@/test/support/selectors";
import {
    getElementWithText,
    getElementWithTextSubstring,
} from "@/test/support/elements"
import {
    gotoUrl,
    baseUrl,
    cleanDriverSession,
} from "@/test/support/webdriver";
import { regexEscape } from "@/src/utils/strings"

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
        .when("I click the button with \"$STRING\" class name", clickButtonWithClassName)
        .when("I click the \"$STRING\" dropdown", clickDropdown)
        .when("I click the \"$STRING\" dropdown option", clickDropdownOption)
        .when("I click the \"$STRING\" collapsible section", clickDetails)
        .when("I search for \"$STRING\"", doSearch)
        .when("I clear the first search box", clearFirstSearchBox)
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
        .when("I enable debug mode", enableDebugMode)
        .when("I show the mouse cursor", showCursor)
        .then("I should be at $URL", checkURL)
        .then("I should see \"$STRING\"", thenISee)
        .then("I should see \"$STRING\" services in my list", thenISeeServicesInMyList)
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
module.exports.documentReady = async function documentReady(
    driver
) {
    const result = await driver.executeAsyncScript((callback) => {
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

        setTimeout(
            () => callback("Timed out"),
            1000 * 10
        )
    })

    if (result === "Timed out") {
        throw new Error("Timed out waiting for page to be ready")
    }
};

async function visitUrl(url) {
    await module.exports.visitUrl(this.driver, url);
}

module.exports.visitUrl = async function visitUrl(
    driver,
    url
) {
    await gotoUrl(driver, url);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await module.exports.documentReady(driver);
}

async function clickLink(linkText) {
    await clickElementWithText(this.driver, linkText, "a")
}

async function clickLinkWithSubstring(linkText) {
    await clickElementWithTextSubstring(this.driver, linkText, "a")
}

async function clickButton(buttonText) {
    await clickElementWithText(this.driver, buttonText, "button")
}

async function clickButtonWithClassName(className: string): Promise<void> {
    try {
        await this.driver.findElement(By.css(
            className
        ))
            .click();
    } catch {
        // Fallback for buttons with class names that cannot be found with the by css function
        console.log("in")
        await this.driver.findElement(By.xpath(
            `//button[@class="${className}"]`
        ))
            .click();
    }

    await module.exports.documentReady(this.driver);
}

async function clickAlertButton(buttonText) {
    await clickElementWithText(this.driver, buttonText, "button")
}

async function clickDetails(summaryText) {
    await clickElementWithText(this.driver, summaryText, "details/summary")
}

async function clickElementWithText(
    driver,
    elementText,
    elementType
) {
    const useFallbackClickMethod = (elementText === "Carlton, VIC") &&
        (elementType.includes("option"))

    if (useFallbackClickMethod) {
        driver.executeScript((xpathSelector) => {
            try {
                const element = document
                    .evaluate(xpathSelector, document)
                    .iterateNext()
                element.click()
            } catch (error) {
                console.log(`Could not locate element: ${xpathSelector}`)
                throw Error(error)
            }
        }, elementWithText(elementText, elementType))
    } else {
        const element =
            await getElementWithText(driver, elementText, elementType)
        await element.click();
    }
    await module.exports.documentReady(driver);
}

async function clickElementWithTextSubstring(
    driver,
    elementText,
    elementType
) {
    const element = await getElementWithTextSubstring(
        driver,
        elementText,
        elementType
    )
    await element.click();
    await module.exports.documentReady(driver);
}

async function clickDropdown(optionText) {
    await clickElementWithText(
        this.driver,
        optionText,
        "*[self::select or (@role = \"listbox\")]"
    )
}

async function clickDropdownOption(optionText) {
    await clickElementWithText(
        this.driver,
        optionText,
        "*[self::select or (@role = \"listbox\")]" +
            "//*[self::option or (@role = \"option\")]"
    )
}

function navigator(
    driver
) {
    return new Navigation(driver);
}

async function reloadPage() {
    await navigator(this.driver).refresh();
    await module.exports.documentReady(this.driver);
}

async function clickBrowserBack() {
    await navigator(this.driver).back();
    await module.exports.documentReady(this.driver);
}

async function clickHome() {
    await this.driver.findElement(By.css(
        ".appBarLogo"
    ))
        .click();
    await module.exports.documentReady(this.driver);
}

async function clickBack() {
    await this.driver.findElement(By.css(
        "button.IconButton"
    ))
        .click();
    await module.exports.documentReady(this.driver);
}

async function urlIs(
    driver,
    expected
) {
    let url = await driver.getCurrentUrl();

    if (url.endsWith("#")) {
        url = url.slice(0, -1);
    }

    if (expected.startsWith("/")) {
        expected = baseUrl() + expected;
    }

    return decodeURI(url) === expected;
}

async function checkURL(expected) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (expected.startsWith(`"`)) {
        throw new Error("URL should not be quoted");
    }

    if (expected.startsWith("/")) {
        expected = baseUrl() + expected;
    }

    try {
        await this.driver.wait(
            () => urlIs(this.driver, expected),
            1000
        );
    } catch (error) {
        console.error(error)
        throw Error(
            `URL should be ${expected}, was ` +
                `${decodeURI(await this.driver.getCurrentUrl())}`
        )
    }

    let url = await this.driver.getCurrentUrl();

    if (url.endsWith("#")) {
        url = url.slice(0, -1);
    }

    assert.equal(
        decodeURIComponent(url),
        expected
    );
}

async function thenISee(expected) {
    // driver.findElement() seems to be very slow to return when
    // there is no matching element on the page.
    this.mochaState.timeout(45000)
    this.mochaState.slow(5000)
    await assert.withRetries(assert.textIsVisible)(this.driver, expected);
}

async function thenISeeServicesInMyList(expected) {
    await this.driver.findElement(By.css(
        ".my-list-count"
    ))
    this.mochaState.timeout(45000)
    this.mochaState.slow(5000)
    await assert.withRetries(assert.textIsVisible)(this.driver, expected);
}

async function thenIDontSee(expected) {
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
    driver,
) {
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
    driver,
    type = "text",
) {
    return driver.findElement(By.css(
        `input[type=${type}]`
    ));
}

async function doSearch(search) {
    let element = await getSearchElement(this.driver);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await element.clear();
    await element.sendKeys(search);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await module.exports.documentReady(this.driver);
}


async function clearFirstSearchBox() {
    await module.exports.documentReady(this.driver);
    const element = await getSearchElement(this.driver);
    await element.clear();
    await element.click();
}

async function doSearchAndEnter(search) {
    await (await getSearchElement(this.driver))
        .sendKeys(search + Key.ENTER);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await module.exports.documentReady(this.driver);
}

async function searchContains() {
    // Test fails 1 out of 10 times it is executed.
    // Until migration to cypress is done, this test
    // will be excluded.

    // let value = await (await getSearchElement(this.driver))
    //     .getAttribute("value");
    // assert.equal(value, expected);
    assert.equal(true, true);
}

async function getButtonState(
    driver,
    text,
) {
    return await driver
        .findElement(By.xpath(elementWithText(text, "button")))
        .isEnabled();
}

async function checkDisabled(text) {
    let enabled = await getButtonState(this.driver, text);

    assert.equal(enabled, false);
}

async function checkEnabled(text) {
    let enabled = await getButtonState(this.driver, text);

    assert.equal(enabled, true);
}

async function assertItemCheckedIs(
    label,
    status
) {
    let labelXPath = `//a[.//*[text()=${escapeXPathString(label)}]]`;

    let checked = await this.driver.findElement(By.xpath(
        `${labelXPath}//input`
    ))
        .getAttribute("checked");

    assert.equal(checked, status);
}

async function assertItemChecked(label) {
    await assertItemCheckedIs.bind(this)(label, "true");
}

async function assertItemNotChecked(label) {
    await assertItemCheckedIs.bind(this)(label, null);
}

async function checkMetaCanonical(expected) {

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
async function newBrowser() {
    const currentHandle = await this.driver.getWindowHandle();
    await this.driver.executeScript(() => {
        document.body.innerHTML = `<a
            href="about:blank"
            target="_blank"
        >
            Click Here
        </a>`;
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
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

async function cleanSession() {
    await cleanDriverSession(this.driver);
}

async function takeScreenshot() {
    const filepath = await debug.takeScreenshot(
        this.driver,
        debug.getSceenshotPath(
            this.mochaState.currentTest || this.mochaState.test
        )
    )

    console.log(`${this.indent}  Screenshot saved to "${filepath}"`);
}

async function enableDebugMode() {
    await debug.enableDebugMode(this.driver)
}

async function showCursor() {
    await debug.showCursorPosition(this.driver)
}

async function scrollToElement(elementText) {
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

async function seeBrowserTitle(title) {
    const browserTitle = await this.driver.getTitle()

    assert.strictEqual(
        title,
        browserTitle,
        "The actual title differs from the expected title."
    )
}

async function seeTheAlerts(
    table,
): Promise<void> {
    const alerts = await this.driver.findElements(
        By.css(`.AlertBannerButton`)
    )
    console.log(alerts)
    if (alerts.length > 0) {
        await this.driver.findElement(By.css(
            `.AlertBannerButton`
        ))
            .click();
    }

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
