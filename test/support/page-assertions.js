import assert from "assert";
import { By } from 'selenium-webdriver';
import selectors from './selectors';

function rootSelector(child) {
    return "//" + child;
}

export async function imageIsVisible(driver, altText, within=rootSelector) {
    const element = await driver.findElement(By.xpath(
        within(`img[@alt = '${altText}']`)
    ));
    const visible = await element.isDisplayed();
    assert(visible, `${altText} image was present but not visible`);
    return element;
}

export async function textIsVisible(driver, text, within=rootSelector) {
    const element = await driver.findElement(By.xpath(
        within(`*[normalize-space(text()) = normalize-space('${text}')]`)
    ));
    const visible = await element.isDisplayed();
    assert(visible, `Text ${text} was present but not visible`);
    return element;
}

