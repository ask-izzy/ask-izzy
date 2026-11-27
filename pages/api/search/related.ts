// "People also searched for" suggestions for the current search.
// See docs/other-services-panel.md § "Where suggestions come from"

import type {NextApiRequest, NextApiResponse} from "next"

import {handleRelatedSearchesRequest} from "@/src/related-searches/api"
import {fetchRelatedSearches} from "@/src/related-searches/iss4"
import {getRelatedSearchFlows} from "@/src/related-searches/flows"
import {getRateLimitMiddlewares} from "@/src/utils/rate-limiting"
import {callMiddlewares} from "@/src/utils/middleware"

// Generous since it's called on every results page. Protects the ISS4 token's
// quota.
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

    // Never log the body: it has what the user typed and their answers
    const {status, body} = await handleRelatedSearchesRequest(
        req.method,
        req.body,
        {fetchRelatedSearches, getFlows: getRelatedSearchFlows},
    )
    res.status(status).json(body)
}
