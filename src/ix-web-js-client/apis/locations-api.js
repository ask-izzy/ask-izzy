/* @flow */
import snakecaseKeys from "snakecase-keys"
import {postRequestWithToken, getRequestWithToken, request} from "../lib/requests"
import {getToken} from "../lib/auth"
type Props = {
    baseUrl: string,
    username: string,
    password: string,
};

export default async function createClient(props: Props): Promise<LocationsApiClient> {
    const client = new LocationsApiClient(props)
    await client.getToken()
    return client
}

type ResultsPage<ResultItem> = {
    count: number,
    next: string,
    previous: string | null,
    facets: Object,
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
    'landmark': 'landmark',
    'local government area': 'lgas',
    'local health district': 'lhds',
    'postcode': 'postcodes',
    'state': 'states',
    'suburb': 'suburbs',
    'landmark': 'landmarks'
}

function getLocationTypePathComponent(locationType: string) {
    const locationTypePathComponent = locationTypeToMap[locationType]

    if (locationTypePathComponent) {
        return locationTypePathComponent
    } else {
        throw Error(
            `The location type "${locationType}" is not supported. ` +
                `Supported types are: ${Object.keys(locationTypeToMap).join(", ")}`)
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
        const url = new URL('token/', this.baseUrl).href
        const res = await request(url, "POST", {}, {
            username: this.username,
            password: this.password
        })
        this.authString = `Bearer ${res.access}`
    }

    async search({
        locationType,
        includeGeoshapes,
        id,
        ...otherParams
    }: Object): Promise<ResultsPage<Location>> {
        const pathComponents = ['search']

        if (locationType && !Array.isArray(locationType)) {
            pathComponents.push(
                getLocationTypePathComponent(locationType)
            )
        } else {
            pathComponents.push('all')
            if (Array.isArray(locationType)) {
                otherParams.locationType = locationType
            }
        }

        if (!includeGeoshapes) {
            pathComponents.push('suggest')
        }

        if (id) {
            if (!locationType) {
                throw Error(
                    `The use of an id without specifying an area type is not supported. Please provide the area type.`
                )
            } else {
                pathComponents.push(id)
            }
        }

        // if (Object.keys(otherParams).length) {
        //     throw Error(
        //         `Other params (${Object.keys(otherParams).join(', ')}) are not yet supported.`
        //     )
        // }



        const url = new URL(pathComponents.join('/') + '/', this.baseUrl)
        const otherParamsArray = Object.entries(snakecaseKeys(otherParams))
        for (const [key, value] of otherParamsArray) {
            const arrayOfValues = Array.isArray(value) ? value : [value]
            for (const singleValue of arrayOfValues) {
                url.searchParams.append(key, singleValue)
            }
        }
        return getRequestWithToken(url.href, this.authString)
    }

    async getLocation({locationType, id, includeGeoshapes}: Object): Promise<Location> {
        const pathComponents = ['search']

        pathComponents.push(
            getLocationTypePathComponent(locationType)
        )

        if (!includeGeoshapes) {
            pathComponents.push('suggest')
        }

        pathComponents.push(id)

        const url = new URL(pathComponents.join('/') + '/', this.baseUrl)
        return getRequestWithToken(url.href, this.authString)
    }

}

// const client = createClient({
//     username: 'askizzy_iss4_migration',
//     password: 'sponsor uneatable exemption dance',
//     baseUrl: 'https://locations.docker.dev/api/'
// }).then(async client => {
//     const res = await client.search({
//         location_type: ["suburb", "postcode"],
//         limit: 100,
//         search: '5152'
//     })
//     console.log(res)
// })


const oldToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQzMTQ5MDE5LCJpYXQiOjE2NDMxNDg3MTksImp0aSI6IjY3ZDJlYTBmNjNlNjRkYjFiOWQ3ZGM3ZmIwMTJiMzJhIiwidXNlcl9pZCI6MTA4fQ.-jxiOsPygeDegCt_H5Bg_gN5yFpSpFpm1W-L9aVbG2E'
