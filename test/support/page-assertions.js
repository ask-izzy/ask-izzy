"use strict";

import assert from "assert";
import { By } from 'selenium-webdriver';
import selectors from './selectors';

function rootSelector(child) {
    return "//" + child;
}

// jscs: disable
assert.imageIsVisible = async function(driver, altText, within=rootSelector) {
    const element = await driver.findElement(By.xpath(
        within(`img[@alt = '${altText}']`)
    ));
    const visible = await element.isDisplayed();
    assert(visible, `${altText} image was present but not visible`);
    return element;
};

// jscs: disable
assert.textIsVisible = async function(driver, text, within=rootSelector) {
    const element = await driver.findElement(By.xpath(
        within(`*[normalize-space(text()) = normalize-space('${text}')]`)
    ));
    const visible = await element.isDisplayed();
    assert(visible, `Text ${text} was present but not visible`);
    return element;
};

export default assert;

