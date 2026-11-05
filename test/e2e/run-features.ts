/*
 * Generates Playwright tests from the Yadda feature files in a directory.
 *
 * Each scenario becomes a test and each of its steps a test step. Steps are
 * matched against the step definitions in ./steps using Yadda.
 */

import fs from "fs"
import path from "path"

import { test } from "@playwright/test"
import type { BrowserContext, ConsoleMessage, Page } from "@playwright/test"
import Yadda from "yadda"

import libraries from "./steps"
import { cleanSession } from "./support/world"
import type { World } from "./support/world"

type Feature = {
    title: string,
    annotations: Record<string, unknown>,
    scenarios: Array<{
        title: string,
        annotations: Record<string, unknown>,
        steps: Array<string>,
    }>,
}

function isSkipped(annotations: Record<string, unknown>): boolean {
    return Boolean(annotations.pending || annotations.skip)
}

function runStep(world: World, step: string): Promise<void> {
    return new Promise((resolve, reject) => {
        Yadda.createInstance(libraries, {world}).run(step, (error?: Error) => {
            error ? reject(error) : resolve()
        })
    })
}

// Serve a fake of the google maps api in place of the real one so scenarios
// never depend on Google. Ask Izzy only waits a second for the api to load
// before giving up on things like travel times, so a slow connection to Google
// used to make scenarios fail.
const fakeGoogleMapsScript = fs.readFileSync(
    path.join(__dirname, "../support/fake-google-maps.js"),
    "utf8",
)

async function fakeGoogleMaps(context: BrowserContext): Promise<void> {
    await context.route(/^https:\/\/maps\.(googleapis|gstatic)\.com\//, async route => {
        if (new URL(route.request().url()).pathname === "/maps/api/js") {
            await route.fulfill({
                status: 200,
                contentType: "text/javascript",
                body: fakeGoogleMapsScript,
            })
        } else {
            await route.fulfill({status: 204})
        }
    })
}

function formatConsoleMessage(message: ConsoleMessage): string {
    return `${message.type().toUpperCase()}: ${message.text()}`
}

export default function runFeatures(directory: string): void {
    if (!process.env.PORT) {
        throw Error("Env var PORT must be set")
    }

    const parser = new Yadda.parsers.FeatureFileParser()

    new Yadda.FeatureFileSearch(directory).each((file: string) => {
        const feature: Feature = parser.parse(file)

        test.describe(feature.title, () => {
            if (isSkipped(feature.annotations)) {
                test.skip()
            }

            // Playwright requires test titles to be unique
            const titleCounts: Record<string, number> = {}
            const uniqueTitle = (title: string) => {
                titleCounts[title] = (titleCounts[title] || 0) + 1
                return titleCounts[title] > 1 ? `${title} (${titleCounts[title]})` : title
            }

            for (const scenario of feature.scenarios) {
                test(uniqueTitle(scenario.title), async({page, context}, testInfo) => {
                    test.skip(isSkipped(scenario.annotations))

                    // Collect logs so they can be printed if the test fails
                    const browserLog: Array<string> = []
                    const recordConsole = (message: ConsoleMessage) =>
                        browserLog.push(formatConsoleMessage(message))
                    const recordPageError = (error: Error) =>
                        browserLog.push(`UNCAUGHT ERROR: ${error.message}`)
                    const watchPage = (page: Page) => {
                        page.on("console", recordConsole)
                        page.on("pageerror", recordPageError)
                    }
                    watchPage(page)
                    context.on("page", watchPage)

                    const world: World = {page, context, testInfo, log: []}

                    try {
                        await test.step("Before scenario", async() => {
                            await fakeGoogleMaps(context)
                            await page.addInitScript(() => {
                                console.log("------------- Loading Page -------------")
                                console.log("URL: " + location.href)
                            })
                            await cleanSession(page)
                        })

                        for (const step of scenario.steps) {
                            browserLog.push(`----- Step: ${step}`)
                            await test.step(step, () => runStep(world, step))
                        }
                    } catch (error) {
                        await testInfo.attach("browser-log", {
                            body: browserLog.join("\n"),
                            contentType: "text/plain",
                        })
                        if (world.log.length) {
                            await testInfo.attach("test-harness-log", {
                                body: world.log.join("\n"),
                                contentType: "text/plain",
                            })
                        }
                        throw error
                    } finally {
                        // Don't fail the test due to requests still in flight
                        await context.unrouteAll({behavior: "ignoreErrors"})
                    }
                })
            }
        })
    })
}
