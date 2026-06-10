/* @flow */

/*
It would be nice to be able to implement this as a simple redirect,
something like:

    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: "/((?!unsupported-browser.html$).*)",
                    has: [
                        {
                            type: "header",
                            key: "user-agent",
                            value: "(.*Trident.*)",
                        },
                    ],
                    hasNot: [
                        {
                            type: "header",
                            key: "cookie",
                            value: "(.*allowUnsupportedBrowser=true.*)",
                        },
                    ]
                    destination: "/unsupported-browser.html",
                },
            ],
        }
    },

Unfortunately Next.js does not yet support matching requests without
some property (in the above the "hasNot" option is made up) so for now
we're stuck with using a middleware.
*/


import { NextResponse } from "next/server"

export const REQUEST_THROTTLED_HEADER = "x-request-throttled"
export const REQUEST_ORG_THROTTLED_HEADER = "x-request-org-throttled"

function getRequestIp(req: any): string | null {
    const forwardedFor = req.headers.get("x-forwarded-for")
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim()
    }
    return null
}

export function middleware(req: any, event: any): any {
    let response

    response = unsupportedBrowserRedirect(req, event)
    if (response) {
        return response
    }

    response = trailingSlashRedirect(req, event)
    if (response) {
        return response
    }

    response = applyRateLimiting(req, event)
    if (response) {
        return response
    }
}

function applyRateLimiting(req: any, event: any): any {
    const headers = new Headers(req.headers)
    const requestIp = getRequestIp(req)
    if (!requestIp) {
        // Allow traffic if we can't determine the IP address, rather than risk blocking legitimate users.
        return
    }
    const orgId = getRequestOrgFromIp(requestIp)

    if (!orgId) {
        return
    }

    headers.set(REQUEST_THROTTLED_HEADER, "1")
    headers.set(REQUEST_ORG_THROTTLED_HEADER, orgId)

    return NextResponse.next({
        request: {
            headers,
        },
    })
}

function isIpInRange(ipAddr: string, range: string): boolean {
    // Single IP address - exact match
    if (!range.includes("/")) {
        return ipAddr === range
    }

    // CIDR notation
    const [rangeIp, maskBits] = range.split("/")
    const mask = parseInt(maskBits, 10)

    // Convert IP addresses to 32-bit integers
    const ipToNumber = (ipStr: string): number => {
        const parts = ipStr.split(".")
        return parts.reduce((acc, part, idx) => {
            return acc + (parseInt(part, 10) << (8 * (3 - idx)))
        }, 0)
    }

    const ipNum = ipToNumber(ipAddr)
    const rangeNum = ipToNumber(rangeIp)

    // Create mask
    const maskValue = mask === 0 ? 0 : (0xFFFFFFFF << (32 - mask)) & 0xFFFFFFFF

    return (ipNum & maskValue) === (rangeNum & maskValue)
}

function getRequestOrgFromIp(requestIp: string): string | null {
    // Get all env var keys
    const envKeys = Object.keys(process.env)

    // Find all IP_RANGE_FOR_* env vars
    for (const key of envKeys) {
        if (key.startsWith("IP_RANGE_FOR_")) {
            const envValue = process.env[key]
            if (!envValue) {
                continue
            }

            const ranges = envValue.split(",").map(range => range.trim())
            if (ranges.some(range => isIpInRange(requestIp, range))) {
                // Extract the org name: IP_RANGE_FOR_ACME -> ACME -> acme
                const orgName = key.replace("IP_RANGE_FOR_", "")
                return orgName.toLowerCase().replace(/_/g, "-")
            }
        }
    }

    return null
}

function unsupportedBrowserRedirect(req: any, event: any): any {
    let unsupportedBrowser = false

    const [, unsupportedBrowserCookieVal] = req.headers.get("cookie")
        ?.match(/unsupportedBrowser=(\w*)/) || []

    if (unsupportedBrowserCookieVal === "true") {
        unsupportedBrowser = true
    } else if (unsupportedBrowserCookieVal === undefined) {
        const isIE = Boolean(
            req.headers.get("user-agent")?.match(/Trident/)
        )
        if (isIE) {
            unsupportedBrowser = true
        }
    }

    if (unsupportedBrowser && !req.nextUrl.pathname.match(/\.\w*$/)) {
        const response = NextResponse.rewrite(
            new URL("/unsupported-browser.html", req.nextUrl.origin)
        )
        response.headers.set("set-cookie", "unsupportedBrowser=true; Path=/")
        return response
    }
}

// We want to remove tailing slashes for Ask Izzy URLs to keep things neater but if we rewrite requests
// that are proxied using our external resources proxy that can produce unexpected behaviour. So we've
// disabled Next.js's automatic trailing slash redirection and we manually apply it here to all requests
// expect those to the proxy.
function trailingSlashRedirect(req: any, event: any): any {
    const { pathname, href } = req.nextUrl

    if (
        pathname.endsWith("/") &&
        pathname.length > 1 &&
        (
            !process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX ||
            // For some reason if the request domain is "*.localhost" it is converted to converted to "localhost" in
            // req.nextUrl. So we can test the proxy locally using "*.localhost" domains we have to use
            // req.headers.host instead.
            !req.headers.get("host").match(`.${process.env.NEXT_PUBLIC_PROXY_DOMAIN_SUFFIX || ""}(?::\\d+)?$`)
        )
    ) {
        return NextResponse.redirect(
            new URL(pathname.replace(/\/+$/, ""), href)
        )
    }
}
