/*
 * Shared state and helpers used by the step definitions
 */

import type { BrowserContext, Locator, Page, TestInfo } from "@playwright/test"

import { elementWithText, elementWithTextSubstring } from "./selectors"

// The state shared between all the steps of a scenario. It's passed to each
// step as `this.world`. Steps can replace the page (eg when opening a new tab)
// so it's stored on an object rather than passed directly.
export type World = {
    page: Page,
    context: BrowserContext,
    testInfo: TestInfo,
    // Output from the test harness which is printed if a step fails
    log: Array<string>,
}

export type StepContext = {
    world: World,
}

declare global {
    // Globals defined by Ask Izzy which the tests use to control it
    interface Window {
        IzzyStorage: any,
        googleMocks?: Array<any>,
        pageFinishedInitialRender?: boolean,
        issQuery?: unknown,
        pi?: () => void,
    }
}

export function baseUrl(): string {
    const port = process.env.PORT

    if (!port) {
        throw Error("PORT env var not set")
    }

    return `http://localhost:${port}`
}

// Since we build pages on request when running the tests the first load of a
// page may be very slow
export const PAGE_LOAD_TIMEOUT = 40 * 1000

export async function gotoUrl(page: Page, url: string): Promise<void> {
    await page.goto(baseUrl() + url, {timeout: PAGE_LOAD_TIMEOUT})
}

/*
 * Wait for the document to be ready (including completing any AJAX requests).
 */
export async function documentReady(page: Page): Promise<void> {
    await page.evaluate(() => console.info("Waiting for document to be ready"))
    try {
        await page.waitForFunction(
            () => window.location.hostname === "localhost" ?
                // Is internal page
                Boolean(window.pageFinishedInitialRender)
                // Is external page
                : document.readyState === "complete",
            null,
            {polling: 10, timeout: 35 * 1000}
        )
    } catch (error) {
        throw new Error("Timed out waiting for page to be ready")
    }
    await page.evaluate(() => console.info("Document ready"))
}

export async function visitUrl(page: Page, url: string): Promise<void> {
    await gotoUrl(page, url)
    await documentReady(page)
}

/*
 * Make sure we're on an Ask Izzy page with a clean session.
 */
export async function cleanSession(page: Page): Promise<void> {
    if (!page.url().includes("localhost")) {
        await gotoUrl(page, "/404")
    }
    await page.evaluate(() => console.log("Clearing browsing session"))
    // Wait for page to load and global storage object to be accessible
    await page.waitForFunction(
        () => typeof window.IzzyStorage !== "undefined",
        null,
        {timeout: 10 * 1000}
    )
    await page.evaluate(() => {
        window.IzzyStorage.clear()
        window.dataLayer = []
        delete window.googleMocks
    })
}

/*
 * Get the deepest visible elements whose text matches the given text
 * (ignoring differences in whitespace).
 */
export function elementsWithText(
    page: Page,
    text: string,
    elementType?: string
): Locator {
    return page
        .locator(`xpath=${elementWithText(text, elementType)}`)
        .filter({visible: true})
}

export function elementsWithTextSubstring(
    page: Page,
    text: string,
    elementType?: string
): Locator {
    return page
        .locator(`xpath=${elementWithTextSubstring(text, elementType)}`)
        .filter({visible: true})
}

/*
 * Poll the given function until it returns without throwing or the timeout is
 * reached in which case the last error is thrown.
 */
export async function retry<T>(
    callback: () => Promise<T>,
    timeout: number = 10 * 1000,
    interval: number = 100,
): Promise<T> {
    const start = Date.now()
    for (;;) {
        try {
            return await callback()
        } catch (error) {
            if (Date.now() - start > timeout) {
                throw error
            }
        }
        await new Promise(resolve => setTimeout(resolve, interval))
    }
}

/*
 * Check if the given element is inside a closed <details> element (and so
 * not visible even though the browser reports it as visible).
 */
async function isInClosedDetails(element: Locator): Promise<boolean> {
    return element.evaluate(element => {
        // step up dom tree to check if we're in a closed details elm
        let current: HTMLElement | null = element as HTMLElement
        while (current) {
            // even when in a closed details element a summary element is
            // always visible. So if we're in a summary element skip over that
            // until we're pass it's containing details element.
            if (current.tagName === "SUMMARY") {
                while (current && current.tagName !== "DETAILS") {
                    current = current.parentElement
                }
                current = current?.parentElement || null
                continue
            }
            if (current.tagName === "DETAILS" && !(current as HTMLDetailsElement).open) {
                return true
            }
            current = current.parentElement
        }
        return false
    })
}

export async function isTextVisible(page: Page, text: string): Promise<boolean> {
    const elements = elementsWithText(page, text)
    const count = await elements.count()
    for (let index = 0; index < count; index++) {
        if (!await isInClosedDetails(elements.nth(index))) {
            return true
        }
    }
    return false
}

export async function assertTextIsVisible(
    page: Page,
    text: string,
    timeout?: number
): Promise<void> {
    await retry(async() => {
        if (!await isTextVisible(page, text)) {
            throw new Error(`Text "${text}" is not visible`)
        }
    }, timeout)
}

export async function assertTextIsNotVisible(
    page: Page,
    text: string,
): Promise<void> {
    // Give the text a short amount of time to appear (eg if the page is still
    // rendering) before deciding it's not there.
    const end = Date.now() + 2 * 1000
    do {
        if (await isTextVisible(page, text)) {
            throw new Error(`Text "${text}" was seen!`)
        }
        await new Promise(resolve => setTimeout(resolve, 100))
    } while (Date.now() < end)
}

/*
 * Get the rendered text of an element normalised the same way Selenium's
 * getText() does (runs of whitespace collapsed, lines trimmed and blank lines
 * removed)
 */
export function normaliseText(text: string): string {
    return text
        .split("\n")
        .map(line => line.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join("\n")
}

export async function getVisibleTexts(elements: Locator): Promise<Array<string>> {
    const texts = await elements.filter({visible: true}).allInnerTexts()
    return texts.map(normaliseText)
}

export async function setStorageValue(
    page: Page,
    key: string,
    value: string | Array<string>,
): Promise<void> {
    await page.evaluate(
        ([key, value]) => {
            if (typeof value === "string") {
                window.IzzyStorage.setItem(key, value)
            } else {
                window.IzzyStorage.setJSON(key, value)
            }
        },
        [key, value] as const
    )
}

/*
 * Register a script which will run on page load before any of the page's own
 * scripts. If we're currently on an Ask Izzy page also run it immediately.
 */
export async function runOnPageLoad(
    page: Page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    script: (arg: any) => void,
    arg: unknown,
    alsoRunNow: boolean = false,
): Promise<void> {
    await page.addInitScript(script, arg)
    if (alsoRunNow && page.url().includes("localhost")) {
        await page.evaluate(script, arg)
    }
}
