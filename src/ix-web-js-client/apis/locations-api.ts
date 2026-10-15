import snakecaseKeys from "snakecase-keys"
import {request, getRequestWithToken} from "../lib/requests"
type Props = {
    baseUrl: string,
    username: string,
    password: string,
};

export default async function createClient(
    props: Props
): Promise<LocationsApiClient> {
    const client = new LocationsApiClient(props)
    await client.getToken()
    return client
}

type ResultsPage<ResultItem> = {
    count: number,
    next: string,
    previous: string | null,
    facets: any,
    results: Array<ResultItem>
}

export type Location = {
    id: number,
    name: string,
    location_type: string,
    suburb?: string,
    state: string,
    lga: string,
    postcode: string,
    // In the form [longitude, latitude]
    centroid?: [number, number],
}

type Token = {
    value: string,
    // Unix timestamp in seconds
    expiry: number,
}

// Refresh tokens a little before they actually expire so they don't expire
// while a request is in flight.
const tokenExpiryBufferInSeconds = 30

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

export class LocationsApiClient {
    baseUrl: string;
    password: string;
    username: string;
    accessToken: Token | null = null;
    refreshToken: Token | null = null;

    constructor({username, password, baseUrl}: Props) {
        this.username = username
        this.password = password
        this.baseUrl = baseUrl
    }

    get authString(): string {
        return `Bearer ${this.accessToken?.value}`
    }

    async getToken(): Promise<void> {
        const url = new URL("/api/token/", this.baseUrl).href
        const res = await request(url, "POST", {}, {
            username: this.username,
            password: this.password,
        })
        this.accessToken = parseToken(res.access)
        this.refreshToken = parseToken(res.refresh)
    }

    // Access tokens are short lived so make sure we have one which is still
    // valid, refreshing it or logging in again if necessary.
    async ensureValidToken(): Promise<void> {
        if (isTokenValid(this.accessToken)) {
            return
        }

        if (this.refreshToken && isTokenValid(this.refreshToken)) {
            try {
                const url = new URL("/api/token/refresh/", this.baseUrl).href
                const res = await request(url, "POST", {}, {
                    refresh: this.refreshToken.value,
                })
                this.accessToken = parseToken(res.access)
                return
            } catch (error) {
                console.warn(
                    "Failed to refresh locations API token, logging in again",
                    error
                )
            }
        }

        await this.getToken()
    }

    async search({
        locationType,
        includeGeoshapes,
        id,
        ...otherParams
    }: any): Promise<ResultsPage<Location>> {
        await this.ensureValidToken()

        const pathComponents = ["", "api", "search"]

        if (locationType && !Array.isArray(locationType)) {
            pathComponents.push(
                getLocationTypePathComponent(locationType)
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
                        ` not supported. Please provide the area type.`
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
    }: any): Promise<Location> {
        await this.ensureValidToken()

        const pathComponents = ["", "api", "search"]

        pathComponents.push(
            getLocationTypePathComponent(locationType)
        )

        if (!includeGeoshapes) {
            pathComponents.push("suggest")
        }

        pathComponents.push(id)

        const url = new URL(pathComponents.join("/") + "/", this.baseUrl)
        return getRequestWithToken(url.href, this.authString)
    }
}

function parseToken(token: string): Token {
    const payload = token.split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    const {exp} = JSON.parse(atob(payload))
    return {value: token, expiry: exp}
}

function isTokenValid(token: Token | null): boolean {
    return Boolean(
        token &&
        token.expiry - tokenExpiryBufferInSeconds > Date.now() / 1000
    )
}
