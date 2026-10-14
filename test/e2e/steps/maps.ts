/*
 * Step definitions for map related steps
 */

import assert from "assert"
import Yadda from "yadda"

import dictionary from "../support/dictionary"
import { retry, runOnPageLoad } from "../support/world"
import type { StepContext } from "../support/world"

export default Yadda.localisation.English.library(dictionary)
    .given("I'm watching map events", instrumentMap)
    .given("googles directions matrix will return\n$yaml", instrumentDistanceMatrix)
    .when("I click on the map", async function(this: StepContext) {
        await this.world.page.evaluate(() => {
            // The maps api is instrumented with extra properties (see instrumentMap())
            const maps: any = window.google.maps
            maps.event.trigger(maps.maps[0], "click")
        })
    })
    .when("I click marker titled \"$STRING\"", clickMarker)
    .then("I should see a map", assertMap)
    .then("I should see markers?\n$table", assertMarkers)
    .then("I can see travel times", assertTravelTimes)
    .then("I should be able to travel there \"$STRING\"", async function(this: StepContext, method: string) {
        await this.world.page
            .locator(`[aria-label='${method}'] svg`)
            .first()
            .waitFor({timeout: 10 * 1000})
    })
    .then("I should not be able to travel there \"$STRING\"", async function(this: StepContext, method: string) {
        assert.equal(
            await this.world.page.locator(`[aria-label='${method}'] svg`).count(),
            0
        )
    })

async function assertTravelTimes(this: StepContext): Promise<void> {
    const page = this.world.page
    // Get current date from loaded page since date might be mocked
    const currentTime = await page.evaluate(() => (new Date()).getTime())

    for (const mode of ["walking", "transit", "driving"]) {
        const arrivalTime = await page
            .locator(`.travel-time.travel-mode-${mode} time`)
            .first()
            .getAttribute("datetime", {timeout: 10 * 1000})

        // Arrival time is a future date
        assert.ok(
            arrivalTime && new Date(arrivalTime).getTime() - currentTime > 0,
            `Expected a future arrival time for ${mode} but got ${arrivalTime}`
        )
    }
}

/*
 * Stub google directions so we can get reliable results
 */
async function instrumentDistanceMatrix(this: StepContext, results: unknown): Promise<void> {
    await runOnPageLoad(this.world.page, results => {
        console.log("Registering google maps api distance matrix mock")
        window.googleMocks = window.googleMocks || []
        window.googleMocks.push({
            maps: {
                DistanceMatrixService: function() {
                    return {
                        getDistanceMatrix: function(params, callback) {
                            const clonedResults = JSON.parse(
                                JSON.stringify(results)
                            )
                            return callback(
                                {
                                    rows: [
                                        {
                                            elements: clonedResults,
                                        },
                                    ],
                                },
                                window.google.maps.DirectionsStatus.OK,
                            )
                        },
                    }
                },
                TravelMode: {
                    "DRIVING": "DRIVING",
                    "WALKING": "WALKING",
                    "TRANSIT": "TRANSIT",
                },
                UnitSystem: {
                    "METRIC": "METRIC",
                },
            },
        })
    }, results, true)
}

/*
 * Instrument Google map so we can poke around in it in tests.
 */
async function instrumentMap(this: StepContext): Promise<void> {
    // Wait until the google maps api has loaded
    await this.world.page.waitForFunction(() => {
        if (!window.google) {
            return false
        }
        // The maps api is instrumented with extra properties (see instrumentMap())
        const maps: any = window.google.maps

        /* Instrument Map */
        const RealMap = maps.Map
        maps.Map = function(...args) {
            const map = RealMap.apply(this, args)
            this.recordMap()
            return map
        }
        maps.maps = []
        maps.Map.prototype = RealMap.prototype
        maps.Map.prototype.recordMap = function() {
            maps.maps.push(this)
        }

        /* Instrument Marker */
        const RealMarker = maps.Marker
        maps.markers = []
        maps.Marker = function(...args) {
            const marker = RealMarker.apply(this, args)
            this.recordMarker()
            return marker
        }
        maps.Marker.prototype = RealMarker.prototype
        maps.Marker.prototype.recordMarker = function() {
            maps.markers.push(this)
        }
        return true
    }, null, {timeout: 10 * 1000})
}

async function clickMarker(this: StepContext, title: string): Promise<void> {
    const errorMsg = await this.world.page.evaluate(title => {
        // The maps api is instrumented with extra properties (see instrumentMap())
        const maps: any = window.google.maps
        for (const marker of maps.markers) {
            if (title === marker.getTitle()) {
                maps.event.trigger(marker, "click", {
                    latLng: marker.getPosition(),
                })
                return
            }
        }
        const titles = JSON.stringify(
            maps.markers.map(marker => marker.getTitle())
        )
        return `Could not find marker with title "${title}" out of ${titles}`
    }, title)

    if (errorMsg) {
        throw new Error(errorMsg)
    }
}

async function assertMap(this: StepContext): Promise<void> {
    // Wait until the map appears
    await this.world.page.waitForFunction(
        () => (window.google?.maps as any)?.maps?.length,
        null,
        {timeout: 10 * 1000}
    )
    assert.equal(
        await this.world.page.locator(".gm-style").first().isVisible(),
        true
    )
}

type MarkerRow = {Title: string, Latitude: string, Longitude: string}

async function assertMarkers(this: StepContext, table: Array<MarkerRow>): Promise<void> {
    /* Sort tables by title for comparison */
    const cmp = (first: MarkerRow, second: MarkerRow) =>
        first.Title.localeCompare(second.Title)

    // Markers may still be being added so give them a chance to appear
    await retry(async() => {
        const markers: Array<MarkerRow> = await this.world.page.evaluate(
            () => (window.google.maps as any).markers.map(marker => {
                const position = marker.getPosition()
                return {
                    Title: marker.getTitle(),
                    // Be aware of floating point precision, we're comparing
                    // to a precision of 6 significant figures
                    Latitude: position.lat().toPrecision(6),
                    Longitude: position.lng().toPrecision(6),
                }
            })
        )
        assert.deepStrictEqual(markers.sort(cmp), [...table].sort(cmp))
    }, 5 * 1000)
}
