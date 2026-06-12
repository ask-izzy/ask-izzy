/* @flow */
import { NextRequest, NextResponse } from "next/server"
import { SlidingWindowRateLimiter } from "@/src/utils/rate-limiting-at-edge"

export const REQUEST_ORG_THROTTLED_COOKIE = "request-throttled-org"

const limiterOptions = {
    windowMs: 60 * 1000, // Length of sliding time window with which to count towards the rate limit
    max: 3, // Number of requests allowed within the sliding time window before requests start being throttled
}
const limiter = new SlidingWindowRateLimiter({
    maxRequests: limiterOptions.max,
    windowMs: limiterOptions.windowMs,
})

export async function rateLimitIfRequired(req: typeof NextRequest): Promise<typeof NextResponse | void> {
    const orgId = getRequestOrgId(req)
    const throttledCookie = req.cookies.get(REQUEST_ORG_THROTTLED_COOKIE)?.value

    const requestThrottled = await checkIfReqShouldBeThrottled(orgId, req)

    if (requestThrottled && orgId && orgId !== throttledCookie) {
        const response = NextResponse.next()
        response.cookies.set(REQUEST_ORG_THROTTLED_COOKIE, orgId, { path: "/" })
        return response
    } else if (requestThrottled === false && throttledCookie) {
        // Clear the cookie if set but requests no longer need to be throttled
        const response = NextResponse.next()
        response.cookies.delete(REQUEST_ORG_THROTTLED_COOKIE)
        return response
    }
}

function getRequestIp(req: typeof NextRequest): string | null {
    const forwardedFor = req.headers.get("x-forwarded-for")
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim()
    }
    return null
}

async function checkIfReqShouldBeThrottled(orgId: string | null, req: typeof NextRequest): Promise<boolean | void> {
    if (!orgId) {
        // Request IP is not part of any known org ranges it should not be throttled
        return false
    }

    try {
        // Currently we only count searches as contributing to rate limiting
        if (requestForSearchPage(req) && req.method === "GET") {
            limiter.registerHit(orgId)
        }

        const rateLimitDetails = limiter.getState(orgId)

        if (!rateLimitDetails.allowed) {
            // Rate limit has been hit so request should be throttled
            return true
        }
    } catch (error) {
        console.error("An error occurred while checking if request should be throttled:", error)
        // Since an unexpected error has occurred err on the side of caution and not throttle the request
        return false
    }

    return false
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


function getRequestOrgId(req: typeof NextRequest): string | null {
    const requestIp = getRequestIp(req)
    if (!requestIp) {
        return null
    }
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


function requestForSearchPage(req: typeof NextRequest): boolean {
    const categoryKeys = [
        "food",
        "housing",
        "money-help",
        "support-and-counselling",
        "dfv-help",
        "everyday-needs",
        "health",
        "advice-and-advocacy",
        "work-and-learning",
        "search",
        "disability-advocacy-finder",
    ]
    const path = req.nextUrl.pathname
    /*
    This regex is designed to match just search pages which includes requests for pages like:
    - /food/3055-VIC
    - /search/search-query/Brunswick-VIC
    - /search/search-query/3055-VIC
    - /disability-advocacy-finder/general/3055-VIC

    But not pages like:
    - /food/3055-VIC/map
    - /search/search-query/3055-VIC/personalise/summary
    - /everyday-needs/3055-VIC/personalise/page/everyday-needs-subcategory
    */
    const reMatchSearchPage = new RegExp(`^/(?:${categoryKeys.join("|")})(?:/[^/]+)?/[^/]+-[^/]+/?$`);

    return Boolean(path.match(reMatchSearchPage))
}
