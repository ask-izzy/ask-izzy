"use strict";

/* @flow */

import assert from "assert";
import { By } from 'selenium-webdriver';
import { deepestPossible } from './selectors';

// flow:disable
// jscs: disable
assert.imageIsVisible = async function(driver, altText) {
    var visible = await driver.findElement(By.xpath(
        `//img[@alt = '${altText}']`
    ))
        .isDisplayed();

    assert(visible, `${altText} image was present but not visible`);
};

// flow:disable
// jscs: disable
assert.textIsVisible = async function(driver, text) {
    var visible = await driver.findElement(By.xpath(
        deepestPossible(`normalize-space(.) = normalize-space('${text}')`)
    ))
        .isDisplayed();

    assert(visible, `Text ${text} was present but not visible`);
};

// flow:disable
// jscs: disable
assert.linkIsVisible = async function(driver, title, expectedTarget) {
    var link = await driver.findElement(By.xpath(
        `//a[normalize-space(.) = normalize-space('${title}')]`
    ));
    var visible = await link.isDisplayed();
    var href = await link.getAttribute('href');

    console.log(href);
    console.log(expectedTarget);
    console.log(visible);

    assert(visible, `Link '${title}' was present but not visible`);
    assert.equal(href, expectedTarget);
};

export default assert;
