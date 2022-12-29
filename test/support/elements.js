import {By} from "selenium-webdriver";

import {
    elementWithText,
    elementWithTextSubstring,
} from "./selectors.js"

export async function getElementWithText(
    driver,
    elementText,
    elementType
) {
    const locator = By.xpath(
        elementWithText(elementText, elementType)
    )
    const driverFound = await driver.findElement(locator)
    return driverFound
}

export async function getElementWithTextSubstring(
    driver,
    elementText,
    elementType
) {
    const locator = By.xpath(
        elementWithTextSubstring(elementText, elementType)
    )
    return driver.findElement(locator)
}
