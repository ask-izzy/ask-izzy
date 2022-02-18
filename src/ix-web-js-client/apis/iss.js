/* @flow */
import {
    postRequestWithToken,
    getRequestWithToken,
} from "../lib/requests.js"

export {createISS3Client, ISS3Client} from "./iss-v3.js";
export type {ISS3SearchQuery} from "./iss-v3.js"

type Props = {
    baseUrl: string,
    token: string,
};

export default function createClient(props: Props): ISS4Client {
    const client = new ISS4Client(props)
    return client
}
export type SearchQuery = {|
    query?: string,
    page?: {
        current: number,
        size: number
    },
    filters?: {
        all?: Array<Object>
    },
    boosts?: {[string]: Object}
|};

type SearchProps = {|
    serialiser?: string,
    ...SearchQuery
|}

export class ISS4Client {
    baseUrl: string
    authString: string;

    constructor({token, baseUrl}: Props) {
        this.baseUrl = baseUrl
        this.authString = `Token ${token}`
    }

    async search({
        serialiser = "detail",
        ...query
    }: SearchProps): Object {
        const params = {
            serialiser,
        }

        const url = new URL("/api/search/", this.baseUrl)
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.append(key, String(value))
        }
        return postRequestWithToken(url.href, this.authString, query)
    }

    async getService(serviceId: number): Object {
        const url = new URL(
            `/api/directory/services/${serviceId}/`,
            this.baseUrl
        ).href
        return getRequestWithToken(url, this.authString)
    }
}
