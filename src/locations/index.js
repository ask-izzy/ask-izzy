import createClient from "../ix-web-js-client/apis/locations-api"

type LocationAutocompleteSuggestions = {
    id: number,
    locationType: string,
    name: string,
    state: string
}

const clientPromise = createClient({
    username: 'askizzy_iss4_migration',
    password: 'sponsor uneatable exemption dance',
    baseUrl: 'https://locations.docker.dev/api/'
})

export async function getLocationAutocompleteSuggestions(
    searchQuery: string
): Array<LocationAutocompleteSuggestions> {
    const client = await clientPromise
    const res = await client.search({
        location_type: ["suburb", "postcode"],
        limit: 15,
        search: searchQuery
    })
    return res.results.map(result => ({
        id: result.id,
        locationType: result.location_type,
        name: result.name,
        state: result.state
    }))
}

export async function getLocationDetails(id: string, locationType: string) {
    const client = await clientPromise
    const res = await client.getLocation({
        locationType: locationType,
        id
    })
    return res
}
