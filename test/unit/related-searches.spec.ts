/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";

import {fetchRelatedSearches} from "../../src/iss/relatedSearches";

type FetchCall = {url: string, init?: RequestInit}

/** @see docs/other-services-panel.md § "Where suggestions come from" */
test.describe("Fetching related searches", function() {
    const originalFetch = global.fetch
    const originalEnv = {...process.env}
    const originalWarn = console.warn
    let calls: Array<FetchCall>

    function mockFetch(status: number, body: unknown): void {
        global.fetch = (async(url: string, init?: RequestInit) => {
            calls.push({url: String(url), init})
            return new Response(JSON.stringify(body), {status})
        }) as typeof fetch
    }

    test.beforeEach(() => {
        calls = []
        process.env.NEXT_PUBLIC_ISS4_BASE_URL = "https://iss4.example.com"
        process.env.NEXT_PUBLIC_ISS4_API_TOKEN = "secret"
        console.warn = () => {}
    })

    test.afterEach(() => {
        global.fetch = originalFetch
        process.env = {...originalEnv}
        console.warn = originalWarn
    })

    test("asks for searches related to the q value from the ask-izzy segment", async() => {
        mockFetch(200, {
            query: "meals",
            segment: "ask-izzy",
            results: ["(food vouchers)", "relief"],
        })

        const results = await fetchRelatedSearches(" meals ")

        assert.deepStrictEqual(results, ["(food vouchers)", "relief"])
        assert.strictEqual(calls.length, 1)
        const url = new URL(calls[0].url)
        assert.strictEqual(
            url.origin + url.pathname,
            "https://iss4.example.com/api/directory/search/related/",
        )
        assert.strictEqual(url.searchParams.get("query"), "meals")
        assert.strictEqual(url.searchParams.get("segment"), "ask-izzy")
        assert.strictEqual(url.searchParams.get("limit"), "8")
        assert.strictEqual(
            (calls[0].init?.headers as Record<string, string>).Authorization,
            "Token secret",
        )
    })

    test("returns nothing when the endpoint is unavailable", async() => {
        mockFetch(503, {detail: "Model loading"})

        assert.deepStrictEqual(await fetchRelatedSearches("meals"), [])
    })

    test("returns nothing when the request fails", async() => {
        global.fetch = (async() => {
            throw new TypeError("Failed to fetch")
        }) as typeof fetch

        assert.deepStrictEqual(await fetchRelatedSearches("meals"), [])
    })

    test("doesn't make a request when ISS4 isn't configured", async() => {
        mockFetch(200, {results: ["meals"]})
        delete process.env.NEXT_PUBLIC_ISS4_BASE_URL

        assert.deepStrictEqual(await fetchRelatedSearches("meals"), [])
        assert.strictEqual(calls.length, 0)
    })

    test("doesn't make a request for an empty q value", async() => {
        mockFetch(200, {results: ["meals"]})

        assert.deepStrictEqual(await fetchRelatedSearches("  "), [])
        assert.strictEqual(calls.length, 0)
    })
})
