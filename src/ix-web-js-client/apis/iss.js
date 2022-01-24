/* @flow */
// import fetch from 'node-fetch';
import {postRequestWithToken} from '../lib/requests.js'
type Props = {
    token: string
};

export default function createClient(props: Props): ISS4Client {
    const client = new ISS4Client(props)
    return client
}


class ISS4Client {
    authString: string;

    constructor({token}: Props) {
        this.authString = `Token ${token}`
    }

    async search(query: Object): Object {
        const url = 'https://api-v4-uat.serviceseeker.com.au/api/search/?serialiser=detail'
        return postRequestWithToken(url, this.authString, query)

    }

}

// const client = createClient({
//     token: 'e6e988b62b52d85eaed1db6a22896dcea3eb1a681f541167e904a6a559b8640c'
// })
// client.search().then(async res => {
//     console.log('done', res)
// })
