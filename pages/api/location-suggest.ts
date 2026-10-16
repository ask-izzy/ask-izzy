import createLocationsApiClient from "@/src/ix-web-js-client/apis/locations-api"
import type {
    LocationsApiClient,
} from "@/src/ix-web-js-client/apis/locations-api"
import { getRateLimitMiddlewares } from "@/src/utils/rate-limiting"
import { callMiddlewares } from "@/src/utils/middleware"

export type LocationSuggestion = {
    name: string,
    state: string,
    postcode: string,
    locationType: "suburb" | "postcode",
}

const middlewares = getRateLimitMiddlewares({
    limit: 300,
    windowMs: 1000 * 60 * 5,
    delayAfter: 150,
    delayMs: 500,
})

// The locations API requires a username and password to get an access token
// so requests must be made server side to keep those credentials secret.
let clientPromise: Promise<LocationsApiClient> | null = null

function getClient(): Promise<LocationsApiClient> {
    if (!clientPromise) {
        clientPromise = createLocationsApiClient({
            baseUrl: process.env.LOCATIONS_API_BASE_URL,
            username: process.env.LOCATIONS_API_USERNAME,
            password: process.env.LOCATIONS_API_PASSWORD,
        })
        // If we fail to create a client make sure we try again next time
        clientPromise.catch(() => {
            clientPromise = null
        })
    }
    return clientPromise
}

// We'll type these correctly with typescript
export default async function handler(req: any, res: any): Promise<any> {
    try {
        await callMiddlewares(middlewares, req, res)
    } catch {
        return res.status(429).json({ message: "Too many requests" })
    }

    const query = req.query.q
    if (typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ message: "The q param is required" })
    }

    try {
        const client = await getClient()
        const results = await client.searchSuggest({
            search: query.trim(),
            limit: 20,
        })
        const suggestions: Array<LocationSuggestion> = results.results
            .filter(
                location => location.location_type === "suburb" ||
                    location.location_type === "postcode"
            )
            .map(location => ({
                name: location.name,
                state: location.state ?? "",
                postcode: location.postcode ?? "",
                locationType: location.location_type as
                    LocationSuggestion["locationType"],
            }))
        return res.status(200).json(suggestions)
    } catch (error) {
        console.error("Failed to fetch location suggestions", error)
        return res.status(502).json({
            message: "Failed to fetch location suggestions",
        })
    }
}
