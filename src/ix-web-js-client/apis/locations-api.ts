import snakecaseKeys from "snakecase-keys"

import {request, getRequestWithToken} from "@/src/ix-web-js-client/lib/requests.js"
type Props = {
    baseUrl: string,
    username: string,
    password: string,
};

export default async function createClient(
    props: Props,
): Promise<LocationsApiClient> {
    const client = new LocationsApiClient(props)
    await client.getToken()
    return client
}

type ResultsPage<ResultItem> = {
    count: number,
    next: string,
    previous: string | null,
    facets: Record<string, any>,
    results: Array<ResultItem>
}

type Location = {
    id: number,
    name: string,
    location_type: string,
    state: string,
    lga: string,
    postcode: string
}

const locationTypeToMap = {
    "local government area": "lgas",
    "local health district": "lhds",
    "postcode": "postcodes",
    "state": "states",
    "suburb": "suburbs",
    "landmark": "landmarks",
}

function getLocationTypePathComponent(locationType: string) {
    const locationTypePathComponent = locationTypeToMap[locationType]

    if (locationTypePathComponent) {
        return locationTypePathComponent
    } else {
        throw Error(
            `The location type "${locationType}" is not supported. ` +
                `Supported types are: ` +
                `${Object.keys(locationTypeToMap).join(", ")}`)
    }
}

class LocationsApiClient {
    authString: string;
    baseUrl: string;
    password: string;
    username: string;

    constructor({username, password, baseUrl}: Props) {
        this.username = username
        this.password = password
        this.baseUrl = baseUrl
    }

    async getToken() {
        const url = new URL("token/", this.baseUrl).href
        const res = await request(url, "POST", {}, {
            username: this.username,
            password: this.password,
        })
        this.authString = `Bearer ${res.access}`
    }

    async search({
        locationType,
        includeGeoshapes,
        id,
        ...otherParams
    }: Record<string, any>): Promise<ResultsPage<Location>> {
        const pathComponents = ["search"]

        if (locationType && !Array.isArray(locationType)) {
            pathComponents.push(
                getLocationTypePathComponent(locationType),
            )
        } else {
            pathComponents.push("all")
            if (Array.isArray(locationType)) {
                otherParams.locationType = locationType
            }
        }

        if (!includeGeoshapes) {
            pathComponents.push("suggest")
        }

        if (id) {
            if (!locationType) {
                throw Error(
                    `The use of an id without specifying an area type is` +
                        ` not supported. Please provide the area type.`,
                )
            } else {
                pathComponents.push(id)
            }
        }

        // if (Object.keys(otherParams).length) {
        //     throw Error(
        //         `Other params (${Object.keys(otherParams).join(', ')}) ` +
        //          `are not yet supported.`
        //     )
        // }



        const url = new URL(pathComponents.join("/") + "/", this.baseUrl)
        const otherParamsArray = Object.entries(snakecaseKeys(otherParams))
        for (const [key, value] of otherParamsArray) {
            const arrayOfValues = Array.isArray(value) ? value : [value]
            for (const singleValue of arrayOfValues) {
                url.searchParams.append(key, String(singleValue))
            }
        }
        return getRequestWithToken(url.href, this.authString)
    }

    async getLocation({
        locationType,
        id,
        includeGeoshapes,
    }: Record<string, any>): Promise<Location> {
        const pathComponents = ["search"]

        pathComponents.push(
            getLocationTypePathComponent(locationType),
        )

        if (!includeGeoshapes) {
            pathComponents.push("suggest")
        }

        pathComponents.push(id)

        const url = new URL(pathComponents.join("/") + "/", this.baseUrl)
        return getRequestWithToken(url.href, this.authString)
    }

}
