/* @flow */

import assert from "assert";
import Webdriver, { By } from "selenium-webdriver";
import { deepestPossible, escapeXPathString } from "./selectors";

// Flow complains about adding properties directly
// to 'assert'; need a type specifier.
var assert_: Object = assert;

export async function imageIsVisible(
    driver: Webdriver.WebDriver,
    altText: string
): Promise<void> {
    var visible = await driver.findElement(By.xpath(
        `//img[@alt = '${altText}']`
    ))
        .isDisplayed();

    assert(visible, `${altText} image was present but not visible`);
}

assert_.imageIsVisible = imageIsVisible;

export async function svgIsVisible(
    driver: Webdriver.WebDriver,
    altText: string
): Promise<void> {
    // svg has a namespace in firefox, which makes xpath queries
    // to pull them out tricky, so I've used css.
    var visible = await driver.findElement(By.css(
        `svg[aria-label='${altText}']`
    ))
        .isDisplayed();

    assert(visible, `${altText} svg was present but not visible`);
}

assert_.svgIsVisible = svgIsVisible;

export async function textIsVisible(
    driver: Webdriver.WebDriver,
    text: string
): Promise<void> {
    text = escapeXPathString(text);

    var visible = await driver.findElement(By.xpath(
        deepestPossible(`normalize-space(.) = normalize-space(${text})`)
    ))
        .isDisplayed();

    assert(visible, `Text ${text} was present but not visible`);
}

assert_.textIsVisible = textIsVisible;

export async function linkIsVisible(
    driver: Webdriver.WebDriver,
    title: string,
    expectedTarget: string
): Promise<void> {
    var link = await driver.findElement(By.xpath(
        `//a[normalize-space(.) = normalize-space('${title}')]`
    ));
    var visible = await link.isDisplayed();

    assert(visible, `Link '${title}' was present but not visible`);

    var href = await link.getAttribute("href");

    assert.equal(href, expectedTarget);
}

assert_.linkIsVisible = linkIsVisible;

export default assert_;
