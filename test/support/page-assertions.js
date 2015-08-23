"use strict";

/* @flow */

import assert from "assert";
import { By } from 'selenium-webdriver';
import selectors from './selectors';

function rootSelector(child) {
    return "//" + child;
}

// flow:disable
// jscs: disable
assert.imageIsVisible = async function(driver, altText, within=rootSelector) {
    var visible = await driver.findElement(By.xpath(
        within(`img[@alt = '${altText}']`)
    ))
        .isDisplayed();

    assert(visible, `${altText} image was present but not visible`);
};

// flow:disable
// jscs: disable
assert.textIsVisible = async function(driver, text, within=rootSelector) {
    var visible = await driver.findElement(By.xpath(
        within(`*[normalize-space(text()) = normalize-space('${text}')]`)
    ))
        .isDisplayed();

    assert(visible, `Text ${text} was present but not visible`);
};

export default assert;

