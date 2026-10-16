import {
    searchAllSuggestList,
    tokenCreate,
    tokenRefreshCreate,
} from "@infoxchange/locations-api"
import type {
    PaginatedGenericLocationSuggestList,
    SearchAllSuggestListData,
} from "@infoxchange/locations-api"

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

type Token = {
    value: string,
    // Unix timestamp in seconds
    expiry: number,
}

// Refresh tokens a little before they actually expire so they don't expire
// while a request is in flight.
const tokenExpiryBufferInSeconds = 30

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

    async getToken(): Promise<void> {
        const {data} = await tokenCreate({
            baseUrl: this.baseUrl,
            body: {username: this.username, password: this.password},
            throwOnError: true,
        })
        this.accessToken = parseToken(data.access)
        this.refreshToken = parseToken(data.refresh)
    }

    // Access tokens are short lived so make sure we have one which is still
    // valid, refreshing it or logging in again if necessary.
    async ensureValidToken(): Promise<void> {
        if (isTokenValid(this.accessToken)) {
            return
        }

        if (this.refreshToken && isTokenValid(this.refreshToken)) {
            try {
                const {data} = await tokenRefreshCreate({
                    baseUrl: this.baseUrl,
                    body: {refresh: this.refreshToken.value},
                    throwOnError: true,
                })
                this.accessToken = parseToken(data.access)
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

    // Search all location types. Shapes aren't returned which makes this
    // suitable for search-as-you-type.
    async searchSuggest(
        query: SearchAllSuggestListData["query"]
    ): Promise<PaginatedGenericLocationSuggestList> {
        await this.ensureValidToken()
        const {data} = await searchAllSuggestList({
            baseUrl: this.baseUrl,
            query,
            auth: () => this.accessToken?.value,
            throwOnError: true,
        })
        return data
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
