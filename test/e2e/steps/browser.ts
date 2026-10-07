/*
 * Step definitions for browser related steps
 */

import assert from "assert"
import Yadda from "yadda"
import type { Page } from "@playwright/test"

import dictionary from "../support/dictionary"
import { elementWithText, escapeXPathString } from "../support/selectors"
import {
    PAGE_LOAD_TIMEOUT,
    normaliseText,
    assertTextIsNotVisible,
    assertTextIsVisible,
    baseUrl,
    cleanSession,
    documentReady,
    elementsWithText,
    elementsWithTextSubstring,
    retry,
    visitUrl,
} from "../support/world"
import type { StepContext } from "../support/world"
import { regexEscape } from "@/src/utils/strings"

export default Yadda.localisation.English.library(dictionary)
    .given("a fresh session", async function(this: StepContext) {
        await cleanSession(this.world.page)
    })
    .given("I open a new browser", newBrowser)
    .when("I visit $URL", async function(this: StepContext, url: string) {
        await visitUrl(this.world.page, url)
    })
    .when("I click the \"$STRING\" link", async function(this: StepContext, text: string) {
        await clickElementWithText(this.world.page, text, "a")
    })
    .when("I click the link with \"$STRING\" substring", async function(this: StepContext, text: string) {
        await clickElementWithTextSubstring(this.world.page, text, "a")
    })
    .when("I click the \"$STRING\" button", async function(this: StepContext, text: string) {
        await clickElementWithText(this.world.page, text, "button")
    })
    .when("I click the button with \"$STRING\" class name", clickButtonWithClassName)
    .when("I click the \"$STRING\" dropdown", async function(this: StepContext, text: string) {
        await clickElementWithText(
            this.world.page,
            text,
            "*[self::select or (@role = \"listbox\")]"
        )
    })
    .when("I click the \"$STRING\" dropdown option", async function(this: StepContext, text: string) {
        await clickElementWithText(
            this.world.page,
            text,
            "*[self::select or (@role = \"listbox\")]" +
                "//*[self::option or (@role = \"option\")]"
        )
    })
    .when("I click the \"$STRING\" collapsible section", async function(this: StepContext, text: string) {
        await clickElementWithText(this.world.page, text, "details/summary")
    })
    .when("I search for \"$STRING\"", doSearch)
    .when("I clear the first search box", clearFirstSearchBox)
    .when("I search for \"$STRING\" and press enter", doSearchAndEnter)
    .when("I click home from the title bar", async function(this: StepContext) {
        await this.world.page.locator(".appBarLogo").first().click()
        await documentReady(this.world.page)
    })
    .when("I click back from the title bar", async function(this: StepContext) {
        await this.world.page.locator("button.IconButton").first().click()
        await documentReady(this.world.page)
    })
    .when("I click back from the browser UI", async function(this: StepContext) {
        await this.world.page.goBack({timeout: PAGE_LOAD_TIMEOUT})
        await documentReady(this.world.page)
    })
    .when("I reload the page", async function(this: StepContext) {
        await this.world.page.reload({timeout: PAGE_LOAD_TIMEOUT})
        await documentReady(this.world.page)
    })
    .when("I wait for page to finish loading", async function(this: StepContext) {
        await documentReady(this.world.page)
    })
    .when("I pause for debugging", async function(this: StepContext) {
        await this.world.page.pause()
    })
    .when("I throw an error", () => {
        throw new Error("Artificial error")
    })
    .when("I scroll to element \"$STRING\"", scrollToElement)
    .when("I take a screenshot", takeScreenshot)
    .when("I enable debug mode", enableDebugMode)
    .when("I show the mouse cursor", showCursor)
    .then("I should be at $URL", checkURL)
    .then("I should see \"$STRING\"", thenISee)
    .then("I should see \"$STRING\" services in my list", thenISeeServicesInMyList)
    .then("I should see\n$STRING", thenISee)
    .then("I should not see \"$STRING\"", async function(this: StepContext, text: string) {
        await assertTextIsNotVisible(this.world.page, text)
    })
    // Checking the value of the search box was flaky with the previous test
    // framework and so was disabled. TODO: Re-enable.
    .then("search box should contain \"$STRING\"", () => undefined)
    .then("search box should contain \"\"", () => undefined)
    .then("the button \"$STRING\" should be disabled", async function(this: StepContext, text: string) {
        assert.equal(await isButtonEnabled(this.world.page, text), false)
    })
    .then("the button \"$STRING\" should be enabled", async function(this: StepContext, text: string) {
        assert.equal(await isButtonEnabled(this.world.page, text), true)
    })
    .then("\"$STRING\" should be checked", async function(this: StepContext, label: string) {
        await assertItemCheckedIs(this.world.page, label, true)
    })
    .then("\"$STRING\" should not be checked", async function(this: StepContext, label: string) {
        await assertItemCheckedIs(this.world.page, label, false)
    })
    .then("the canonical meta is $URL", checkMetaCanonical)
    .then("I should see the alerts\n$table", seeTheAlerts)
    .then("I should see the browser tab title of \"$STRING\"", seeBrowserTitle)

export async function clickElementWithText(
    page: Page,
    elementText: string,
    elementType?: string
): Promise<void> {
    const element = elementsWithText(page, elementText, elementType).first()
    try {
        // The element may not be visible yet (eg if it's still rendering) so
        // give it a chance to appear
        await element.waitFor({timeout: 10 * 1000})
    } catch (error) {
        throw Error(
            `Could not find a visible ${elementType || "element"} ` +
            `with the text "${elementText}"`
        )
    }
    await element.click({timeout: PAGE_LOAD_TIMEOUT})
    // Wait just long enough that useTrackInitialRenderStatus() will have had
    // a chance to update window.pageFinishedInitialRender if we navigated
    await new Promise(resolve => setTimeout(resolve, 10))
    await documentReady(page)
}

async function clickElementWithTextSubstring(
    page: Page,
    elementText: string,
    elementType?: string
): Promise<void> {
    await elementsWithTextSubstring(page, elementText, elementType)
        .first()
        .click({timeout: PAGE_LOAD_TIMEOUT})
    await new Promise(resolve => setTimeout(resolve, 10))
    await documentReady(page)
}

async function clickButtonWithClassName(this: StepContext, className: string): Promise<void> {
    const page = this.world.page
    try {
        await page.locator(className).first().click({timeout: 5 * 1000})
    } catch {
        // Fallback for buttons with class names that aren't valid css selectors
        await page.locator(`xpath=//button[@class="${className}"]`).first().click()
    }
    await documentReady(page)
}

function getSearchElement(page: Page) {
    return page.locator("input[type=search]").first()
}

async function doSearch(this: StepContext, search: string): Promise<void> {
    const element = getSearchElement(this.world.page)
    await element.clear({timeout: PAGE_LOAD_TIMEOUT})
    await element.pressSequentially(search)
    await documentReady(this.world.page)
}

async function clearFirstSearchBox(this: StepContext): Promise<void> {
    await documentReady(this.world.page)
    const element = getSearchElement(this.world.page)
    await element.clear()
    await element.click()
}

async function doSearchAndEnter(this: StepContext, search: string): Promise<void> {
    const element = getSearchElement(this.world.page)
    await element.pressSequentially(search, {timeout: PAGE_LOAD_TIMEOUT})
    await element.press("Enter")
    await documentReady(this.world.page)
}

function normaliseUrl(url: string): string {
    if (url.endsWith("#")) {
        url = url.slice(0, -1)
    }
    return url
}

async function checkURL(this: StepContext, expected: string): Promise<void> {
    if (expected.startsWith(`"`)) {
        throw new Error("URL should not be quoted")
    }

    if (expected.startsWith("/")) {
        expected = baseUrl() + expected
    }

    try {
        await retry(async() => {
            assert.equal(decodeURI(normaliseUrl(this.world.page.url())), expected)
        }, 5 * 1000)
    } catch (error) {
        throw Error(
            `URL should be ${expected}, was ` +
                `${decodeURI(this.world.page.url())}`
        )
    }

    assert.equal(
        decodeURIComponent(normaliseUrl(this.world.page.url())),
        expected
    )
}

async function thenISee(this: StepContext, expected: string): Promise<void> {
    await assertTextIsVisible(this.world.page, expected)
}

async function thenISeeServicesInMyList(this: StepContext, expected: string): Promise<void> {
    await this.world.page.locator(".my-list-count").first().waitFor({state: "attached"})
    await assertTextIsVisible(this.world.page, expected)
}

async function isButtonEnabled(page: Page, text: string): Promise<boolean> {
    return page.locator(`xpath=${elementWithText(text, "button")}`).first().isEnabled()
}

async function assertItemCheckedIs(
    page: Page,
    label: string,
    checked: boolean
): Promise<void> {
    const labelXPath = `//a[.//*[text()=${escapeXPathString(label)}]]`
    const input = page.locator(`xpath=${labelXPath}//input`).first()
    assert.equal(await input.isChecked(), checked)
}

async function checkMetaCanonical(this: StepContext, expected: string): Promise<void> {
    const getCanonicalPath = async() => {
        const content = await this.world.page
            .locator("link[rel=canonical]")
            .first()
            .getAttribute("content", {timeout: 5 * 1000})

        return decodeURIComponent(content || "").replace(/^.*\/\/[^/]+/, "")
    }

    // The page may still be redirecting client-side (eg to add the location
    // to the path) so give the canonical url a chance to update
    try {
        await retry(async() => {
            assert.equal(await getCanonicalPath(), expected)
        }, 10 * 1000)
    } catch (error) {
        // Fall through to the assertion below for a useful error message
    }

    assert.equal(await getCanonicalPath(), expected)
}

/*
 * Open a new tab (from a link on the current page) and switch to it
 */
async function newBrowser(this: StepContext): Promise<void> {
    const page = this.world.page
    await page.evaluate(() => {
        document.body.innerHTML = `<a
            href="about:blank"
            target="_blank"
        >
            Click Here
        </a>`
    })
    const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        page.getByText("Click Here").click(),
    ])
    await newPage.waitForLoadState()
    this.world.page = newPage
}

async function takeScreenshot(this: StepContext): Promise<void> {
    const path = this.world.testInfo.outputPath("screenshot.png")
    await this.world.page.screenshot({path})
    this.world.log.push(`Screenshot saved to "${path}"`)
}

async function enableDebugMode(this: StepContext): Promise<void> {
    await this.world.page.evaluate(() => {
        if (typeof window.pi === "function") {
            window.pi()
        } else {
            console.warn("pi function not yet set so can't enable debug mode")
        }
    })
}

async function showCursor(this: StepContext): Promise<void> {
    // based off https://stackoverflow.com/a/67180588
    await this.world.page.evaluate(() => {
        const styleElm = document.createElement("style")
        styleElm.appendChild(document.createTextNode(`
            .dot {
                top: 0;
                left: 0;
                background: red;
                position: absolute;
                width: 10px;
                height: 10px;
                z-index: 10000;
                border-radius: 50%;
                pointer-events: none;
            }
        `))
        document.body.appendChild(styleElm)

        const dotElm = document.createElement("div")
        dotElm.className = "dot"
        document.body.appendChild(dotElm)

        document.addEventListener("mousemove", event => {
            dotElm.style.left = event.pageX + "px"
            dotElm.style.top = event.pageY + "px"
        })
    })
}

async function scrollToElement(this: StepContext, elementText: string): Promise<void> {
    const element = this.world.page.locator(`xpath=${elementWithText(elementText)}`).first()
    if (!await element.count()) {
        throw Error(`Can't find element with text "${elementText}"`)
    }
    await element.evaluate(element => element.scrollIntoView({block: "center"}))
}

async function seeBrowserTitle(this: StepContext, title: string): Promise<void> {
    assert.strictEqual(
        title,
        await this.world.page.title(),
        "The actual title differs from the expected title."
    )
}

async function seeTheAlerts(
    this: StepContext,
    table: Array<{Title: string, Body: string}>,
): Promise<void> {
    const alertElements = this.world.page.locator(".AlertBannerList .AlertBanner")
    assert.strictEqual(
        await alertElements.count(),
        table.length,
        "The number of actual alerts and expected alerts differ."
    )

    const textMatchesGlob = (text: string, glob: string) => {
        assert.match(
            text,
            new RegExp(
                "^" + regexEscape(glob).replace("\\*", "[\\s\\S]*") + "$"
            )
        )
    }

    for (const [index, row] of table.entries()) {
        const alertElement = alertElements.nth(index)
        const titleElementText = normaliseText(await alertElement
            .locator(".title-container")
            .first()
            .innerText())

        // body is optional in some alerts
        const bodyElement = alertElement.locator(".body").first()
        const bodyElementText = await bodyElement.count() ?
            normaliseText(await bodyElement.innerText())
            : ""

        textMatchesGlob(titleElementText, row.Title)
        textMatchesGlob(bodyElementText, row.Body)
    }
}
