/* @flow */

import createLocationsApiClient from "../ix-web-js-client/apis/locations-api"

export type LocationAutocompleteSuggestions = {
    id: number,
    locationType: string,
    name: string,
    state: string
}

let clientPromise;
if (typeof window !== "undefined") {
    clientPromise = createLocationsApiClient({
        username: "askizzy_iss4_migration",
        password: "posture cauterize clarity foothill",
        baseUrl: window.LOCATIONS_API_BASE_URL,
    })
}

export async function getLocationAutocompleteSuggestions(
    searchQuery: string
): Promise<Array<LocationAutocompleteSuggestions>> {
    const client = await clientPromise
    const res = await client.search({
        location_type: ["suburb", "postcode"],
        limit: 15,
        search: searchQuery,
    })
    return res.results.map(result => ({
        id: result.id,
        locationType: result.location_type,
        name: result.name,
        state: result.state,
    }))
}

export async function getLocationDetails(id: string, locationType: string) {
    const client = await clientPromise
    const res = await client.getLocation({
        locationType: locationType,
        id,
    })
    return res
}
