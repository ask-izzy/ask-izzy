/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";
import { LocationsApiClient } from "../../src/ix-web-js-client/apis/locations-api";

function createFakeJwt(secondsUntilExpiry: number): string {
    const encode = (obj: object) =>
        Buffer.from(JSON.stringify(obj)).toString("base64url")
    return [
        encode({alg: "HS256", typ: "JWT"}),
        encode({exp: Math.round(Date.now() / 1000) + secondsUntilExpiry}),
        "fake-signature",
    ].join(".")
}

type MockedResponse = {status?: number, body: unknown}

function mockFetch(
    responses: {[path: string]: Array<MockedResponse>}
): Array<string> {
    const requestedPaths: Array<string> = []
    global.fetch = (async(url: string) => {
        const path = new URL(url).pathname
        requestedPaths.push(path)
        const response = responses[path]?.shift()
        if (!response) {
            throw new Error(`Unexpected request to ${path}`)
        }
        const status = response.status || 200
        return {
            status,
            json: async() => response.body,
            text: async() => JSON.stringify(response.body),
        }
    }) as unknown as typeof fetch
    return requestedPaths
}

const suggestResponse = {body: {count: 0, results: []}}

test.describe("Locations API client", function() {
    const originalFetch = global.fetch

    test.afterEach(function() {
        global.fetch = originalFetch
    })

    function createClient() {
        return new LocationsApiClient({
            baseUrl: "https://locations.example.com",
            username: "user",
            password: "pass",
        })
    }

    test("logs in before the first request", async function() {
        const requestedPaths = mockFetch({
            "/api/token/": [{body: {
                access: createFakeJwt(300),
                refresh: createFakeJwt(86400),
            }}],
            "/api/search/all/suggest/": [suggestResponse],
        })

        await createClient().search({search: "carlt"})

        assert.deepStrictEqual(requestedPaths, [
            "/api/token/",
            "/api/search/all/suggest/",
        ])
    })

    test("reuses a valid access token", async function() {
        const requestedPaths = mockFetch({
            "/api/token/": [{body: {
                access: createFakeJwt(300),
                refresh: createFakeJwt(86400),
            }}],
            "/api/search/all/suggest/": [suggestResponse, suggestResponse],
        })

        const client = createClient()
        await client.search({search: "carlt"})
        await client.search({search: "carlton"})

        assert.deepStrictEqual(requestedPaths, [
            "/api/token/",
            "/api/search/all/suggest/",
            "/api/search/all/suggest/",
        ])
    })

    test("refreshes an expired access token", async function() {
        const requestedPaths = mockFetch({
            "/api/token/": [{body: {
                access: createFakeJwt(-10),
                refresh: createFakeJwt(86400),
            }}],
            "/api/token/refresh/": [{body: {access: createFakeJwt(300)}}],
            "/api/search/all/suggest/": [suggestResponse],
        })

        const client = createClient()
        await client.getToken()
        await client.search({search: "carlt"})

        assert.deepStrictEqual(requestedPaths, [
            "/api/token/",
            "/api/token/refresh/",
            "/api/search/all/suggest/",
        ])
    })

    test("logs in again when the refresh token has expired", async function() {
        const requestedPaths = mockFetch({
            "/api/token/": [
                {body: {
                    access: createFakeJwt(-10),
                    refresh: createFakeJwt(-10),
                }},
                {body: {
                    access: createFakeJwt(300),
                    refresh: createFakeJwt(86400),
                }},
            ],
            "/api/search/all/suggest/": [suggestResponse],
        })

        const client = createClient()
        await client.getToken()
        await client.search({search: "carlt"})

        assert.deepStrictEqual(requestedPaths, [
            "/api/token/",
            "/api/token/",
            "/api/search/all/suggest/",
        ])
    })

    test("logs in again when refreshing fails", async function() {
        const requestedPaths = mockFetch({
            "/api/token/": [
                {body: {
                    access: createFakeJwt(-10),
                    refresh: createFakeJwt(86400),
                }},
                {body: {
                    access: createFakeJwt(300),
                    refresh: createFakeJwt(86400),
                }},
            ],
            "/api/token/refresh/": [{status: 401, body: {detail: "Bad"}}],
            "/api/search/all/suggest/": [suggestResponse],
        })

        const client = createClient()
        await client.getToken()
        await client.search({search: "carlt"})

        assert.deepStrictEqual(requestedPaths, [
            "/api/token/",
            "/api/token/refresh/",
            "/api/token/",
            "/api/search/all/suggest/",
        ])
    })
})
