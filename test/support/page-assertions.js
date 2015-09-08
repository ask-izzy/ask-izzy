"use strict";
/* @flow */

import assert from "assert";
import Webdriver, { By } from 'selenium-webdriver';
import { deepestPossible } from './selectors';

// Flow complains about adding properties directly
// to 'assert'; need a type specifier.
var a: Object = assert;
a.imageIsVisible = imageIsVisible;
export async function imageIsVisible(
    driver: Webdriver.WebDriver,
    altText: string
): Promise<void> {
    // jscs: disable
    var visible = await driver.findElement(By.xpath(
        `//img[@alt = '${altText}']`
    ))
        .isDisplayed();

    assert(visible, `${altText} image was present but not visible`);
};

a.textIsVisible = textIsVisible;
export async function textIsVisible(
    driver: Webdriver.WebDriver,
    text: string
): Promise<void> {
    // jscs: disable
    var visible = await driver.findElement(By.xpath(
        deepestPossible(`normalize-space(.) = normalize-space('${text}')`)
    ))
        .isDisplayed();

    assert(visible, `Text ${text} was present but not visible`);
};

a.linkIsVisible = linkIsVisible;
export async function linkIsVisible(
    driver: Webdriver.WebDriver,
    title: string,
    expectedTarget: string
): Promise<void> {
    // jscs: disable
    var link = await driver.findElement(By.xpath(
        `//a[normalize-space(.) = normalize-space('${title}')]`
    ));
    var visible = await link.isDisplayed();
    var href = await link.getAttribute('href');

    assert(visible, `Link '${title}' was present but not visible`);
    assert.equal(href, expectedTarget);
};

export default a;
