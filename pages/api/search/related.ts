// "People also searched for" suggestions for the current search.
// See docs/other-services-panel.md § "Where suggestions come from"

import type {NextApiRequest, NextApiResponse} from "next"

import {handleRelatedSearchesRequest} from "@/src/related-searches/api"
import {fetchRelatedSearches} from "@/src/related-searches/iss4"
import {getRelatedSearchFlows} from "@/src/related-searches/flows"
import {getRateLimitMiddlewares} from "@/src/utils/rate-limiting"
import {callMiddlewares} from "@/src/utils/middleware"

// Called on every results page load, so generous. It's there to protect the
// ISS4 token's quota from anything hammering the endpoint.
const middlewares = getRateLimitMiddlewares({
    limit: 300,
    windowMs: 1000 * 60,
    delayAfter: 150,
    delayMs: 100,
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    try {
        await callMiddlewares(middlewares, req, res)
    } catch {
        return res.status(429).json({message: "Too many requests"})
    }

    // The body is never logged since later it includes the user's answers
    const {status, body} = await handleRelatedSearchesRequest(
        req.method,
        req.body,
        {fetchRelatedSearches, getFlows: getRelatedSearchFlows},
    )
    res.status(status).json(body)
}
