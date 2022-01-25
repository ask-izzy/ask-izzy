/* @flow */
// import fetch from 'node-fetch';
import {
    postRequestWithToken,
    getRequestWithToken
} from '../lib/requests.js'
type Props = {
    token: string,
    baseUrl: string
};

export default function createClient(props: Props): ISS4Client {
    const client = new ISS4Client(props)
    return client
}

type SearchProps = {
    term: string,
    filters?: {[string]: Object},
    boosts?: {[string]: Object},
    serialiser?: string
}


export class ISS4Client {
    authString: string;
    baseUrl: string

    constructor({token, baseUrl}: Props) {
        this.authString = `Token ${token}`
        this.baseUrl = baseUrl
    }

    async search({
        serialiser = 'detail',
        ...query
    }: SearchProps): Object {
        const params = {
            serialiser
        }

        const url = new URL('/api/search/', this.baseUrl)
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.append(key, value)
        }
        return postRequestWithToken(url.href, this.authString, query)
    }

    async getService(serviceId: number): Object {
        const url = new URL(`/api/directory/services/${serviceId}/`, this.baseUrl).href
        return getRequestWithToken(url, this.authString)
    }
}

// const client = createClient({
//     token: 'e6e988b62b52d85eaed1db6a22896dcea3eb1a681f541167e904a6a559b8640c'
// })
// client.search().then(async res => {
//     console.log('done', res)
// })
