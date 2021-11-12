/* @flow */

import {WebDriver, WebElement, By} from "selenium-webdriver";

import {
    elementWithText,
    elementWithTextSubstring,
} from "./selectors"

export async function getElementWithText(
    driver: typeof WebDriver,
    elementText: string,
    elementType?: string
): ?typeof WebElement {
    const locator = By.xpath(
        elementWithText(elementText, elementType)
    )
    return driver.findElement(locator)
}

export async function getElementWithTextSubstring(
    driver: typeof WebDriver,
    elementText: string,
    elementType?: string
): ?typeof WebElement {
    const locator = By.xpath(
        elementWithTextSubstring(elementText, elementType)
    )
    return driver.findElement(locator)
}
