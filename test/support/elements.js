/* @flow */

import {WebDriver, WebElement, By} from "selenium-webdriver";

import {
    elementWithText,
    elementWithTextSubstring,
} from "./selectors"

async function isVisibleElement(
    element: typeof WebElement
) {
    while (element) {
        console.log("Checking Element", await element.getTagName());
        if (!await element.isDisplayed()) {
            console.log("Invisible");
            return false;
        }
        element = await element.findElement(By.xpath(".."));
        if (await element.getTagName() === "body") {
            return true;
        }
    }
    return true;
}

export async function FilterVisibleElements(
    elements:Array<typeof WebElement>
): Promise<Array<typeof WebElement>> {
    const visibleElements = []
    for (const element of elements) {
        if (await isVisibleElement(element)) {
            visibleElements.push(element)
        }
    }
    return visibleElements
}

export async function getElementWithText(
    driver: typeof WebDriver,
    elementText: string,
    elementType?: string
): ?typeof WebElement {
    const locator = By.xpath(
        elementWithText(elementText, elementType)
    )

    const elementsFound = await driver.findElements(locator)
    const visibleElementsFound = await FilterVisibleElements(elementsFound)
    return visibleElementsFound[0]
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