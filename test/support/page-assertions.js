/* @flow */

import assert from "assert";
import Webdriver, { By } from "selenium-webdriver";
import { deepestPossible, escapeXPathString } from "./selectors";

// Flow complains about adding properties directly
// to 'assert'; need a type specifier.
let assert_: Object = assert;

export async function imageIsVisible(
    driver: typeof Webdriver.WebDriver,
    altText: string
): Promise<void> {
    let visible = await driver.findElement(By.xpath(
        `//img[@alt = '${altText}']`
    ))
        .isDisplayed();

    assert(visible, `${altText} image was present but not visible`);
}

assert_.imageIsVisible = imageIsVisible;

export async function svgIsVisible(
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

assert_.svgIsVisible = svgIsVisible;

export async function textIsVisible(
    driver: typeof Webdriver.WebDriver,
    text: string
): Promise<void> {
    text = escapeXPathString(text);

    let visible = await driver.findElement(By.xpath(
        deepestPossible(`normalize-space(.) = normalize-space(${text})`)
    ))
        .isDisplayed();

    assert(visible, `Text ${text} was present but not visible`);
}

assert_.textIsVisible = textIsVisible;

export async function linkIsVisible(
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

assert_.linkIsVisible = linkIsVisible;

// needs a way to retry up to a timeout.
// Often getting stuff 'in the dom' but not visible yet.
function withRetries(other: Function): Function {
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

assert_.withRetries = withRetries;
export default assert_;
