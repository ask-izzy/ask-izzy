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

export default assert;

