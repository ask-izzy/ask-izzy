/* @flow */

import assert from "assert";
import Webdriver, { By } from "selenium-webdriver";
import { getElementWithText } from "./elements";
import { isElementPresent } from "./webdriver";

// Flow complains about adding properties directly
// to 'assert'; need a type specifier.
let assertExtended: Object = assert;

assertExtended.imageIsVisible = async function(
    driver: typeof Webdriver.WebDriver,
    altText: string
): Promise<void> {
    let visible = await driver.findElement(By.xpath(
        `//img[@alt = '${altText}']`
    ))
        .isDisplayed();

    assert(visible, `${altText} image was present but not visible`);
}

assertExtended.svgIsVisible = async function(
    driver: typeof Webdriver.WebDriver,
    altText: string
): Promise<void> {
    // svg has a namespace in firefox, which makes xpath queries
    // to pull them out tricky, so I've used css.
    let visible = await driver.findElement(By.css(
        `[aria-label='${altText}'] svg`
    ))
        .isDisplayed();

    assert(visible, `${altText} svg was present but not visible`);
}

assertExtended.textIsVisible = async function(
    driver: typeof Webdriver.WebDriver,
    text: string
): Promise<void> {
    const element = await getElementWithText(driver, text)

    assert(element, `Text "${text}" does not exist`);

    let visible = element ? await element.isDisplayed() : false;

    assert(visible, `Text "${text}" is present but not visible`);

    // isDisplayed doesn't currently check if text is in a closed <details>
    // element so we've got to check for that manually.
    if (visible) {
        visible = await driver.executeScript(
            (element) => {
                // step up dom tree to check if we're in a closed details elm
                while (element) {
                    // even when in a closed details element a summary
                    // element is always visible. So if we're in a summary
                    // element skip over that until we're pass it's containing
                    // details element.
                    if (element.tagName === "SUMMARY") {
                        while (element.tagName !== "DETAILS") {
                            element = element.parentElement
                        }
                        element = element.parentElement
                        continue
                    }
                    if (element.tagName === "DETAILS" && !element.open) {
                        return false
                    }
                    element = element.parentElement
                }
                return true
            },
            element
        )
    }

    assert(visible, `Text "${text}" is present but not visible`);
}

assertExtended.linkIsVisible = async function(
    driver: typeof Webdriver.WebDriver,
    title: string,
    expectedTarget: string
): Promise<void> {
    let link = await driver.findElement(By.xpath(
        `//a[normalize-space(.) = normalize-space('${title}')]`
    ));
    let visible = await link.isDisplayed();

    assert(visible, `Link '${title}' was present but not visible`);

    let href = await link.getAttribute("href");

    assert.equal(href, expectedTarget);
}

// needs a way to retry up to a timeout.
// Often getting stuff 'in the dom' but not visible yet.
assertExtended.withRetries = function(other: Function): Function {
    let retries = 0;
    const retry = async function() {
        try {
            return await other(...arguments)
        } catch (error) {
            if (retries < 3) {
                retries++;
                await retry(...arguments)
            } else {
                throw error;
            }
        }
    }

    return retry;
}

assertExtended.isElementPresent = async function(
    driver: typeof Webdriver.WebDriver, locator: typeof By | Function
): Promise<void> {
    assert(
        await isElementPresent(driver, locator),
        `Element was not found on the page`
    );
}

export default assertExtended;
