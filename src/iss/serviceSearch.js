/* @flow */
import Service from "../services/Service";
import storage from "../storage";
import {getIssClient, getIss3Client} from "./client"
import type { RouterContextObject } from "../contexts/router-context";
import type {
    SearchQuery as IssSearchQuery,
    ISS3SearchQuery as Iss3SearchQuery,
} from "../ix-web-js-client/apis/iss.js"
import type {SearchQuery as IzzySearchQuery} from "./searchQueryBuilder"

export const previousSearchQueryStorageKey = "previousSearchQuery"

export function createServiceSearch(query: IzzySearchQuery): PaginatedSearch {
    return new PaginatedSearch(query)
}

type QueryInfo = (
    {
        izzyQuery: IzzySearchQuery,
        issQuery: IssSearchQuery,
        issVersion: "4",
    } | {
        izzyQuery: IzzySearchQuery,
        issQuery: Iss3SearchQuery,
        issVersion: "3",
    }
)

export class PaginatedSearch {
    #queryInfo: QueryInfo;
    #pagesLoaded: number = 0;
    #maxPageSize: number;
    #loadedServices: Array<Service> = [];
    #cake: IzzySearchQuery;

    constructor(query: IzzySearchQuery) {
        const {maxPageSize = 10, apiVersion = "3", ...remainingQuery} = query
        this.#maxPageSize = maxPageSize
        if (apiVersion === "4") {
            this.#queryInfo = {
                izzyQuery: query,
                issQuery: convertIzzySearchQueryToIss(remainingQuery),
                issVersion: "4",
            }
        } else if (apiVersion === "3") {
            let issQuery
            if (
                storage.getDebug() &&
                storage.getJSON("issParamsOverride")
            ) {
                issQuery = storage.getJSON("issParamsOverride")
            } else {
                issQuery = convertIzzySearchQueryToIss3(remainingQuery)
            }
            this.#queryInfo = {
                izzyQuery: query,
                issQuery,
                issVersion: "3",
            }
        }
    }

    async loadNextPage() {
        const queryInfo = this.#queryInfo
        let services: Service[]

        if (queryInfo.issVersion === "4") {
            const issClient = await getIssClient()
            const res = await issClient.search({
                ...queryInfo.issQuery,
                page: {
                    current: this.#pagesLoaded + 1,
                    size: this.#maxPageSize,
                },
            })
            this.#pagesLoaded++;
            services = res.results.map(
                serviceData => new Service(serviceData)
            )
        } else if (queryInfo.issVersion === "3") {
            const iss3Client = await getIss3Client()
            const res = await iss3Client.search({
                ...queryInfo.issQuery,
                offset: this.#pagesLoaded * this.#maxPageSize,
                limit: this.#maxPageSize,
            })
            services = res?.objects.map(
                serviceData => new Service(serviceData)
            ) || []
        } else {
            throw Error(
                `Api version "${queryInfo.issVersion}" is not recognised`
            )
        }

        this.#loadedServices.push(...services)
        this.#pagesLoaded++;
    }

    get loadedServices(): Array<Service> {
        return this.#loadedServices
    }

    get numOfPagesLoaded(): number {
        return this.#pagesLoaded
    }

    get issQuery(): IssSearchQuery | Iss3SearchQuery {
        return this.#queryInfo.issQuery
    }
}

export function isDisabilityAdvocacySearch(
    router: $PropertyType<RouterContextObject, 'router'>
): boolean {
    return decodeURIComponent(router.match.params.search) ===
        "Disability Advocacy Providers"
}

export function convertIzzySearchQueryToIss(
    query: IzzySearchQuery
): IssSearchQuery {
    const issQuery: IssSearchQuery = {
        filters: {
            all: [
                {
                    object_type: "Service",
                },
            ],
        },
        boosts: {
            is_crisis: {
                type: "value",
                value: "true",
                operation: "multiply",
                factor: 1.5,
            },
        },
    }

    if (query.term) {
        issQuery.query = query.term.join(" ")
    }

    if (query.serviceTypes) {
        issQuery.filters?.all?.push({
            service_types: query.serviceTypes,
        })
    }

    if (query.clientGenders) {
        const genderBoost = query.clientGenders.map(
            gender => ({
                factor: 1.5,
                operation: "multiply",
                type: "value",
                value: gender,
            })
        )
        if (!issQuery.boosts) {
            issQuery.boosts = {}
        }
        issQuery.boosts.target_gender = genderBoost
    }

    if (query.location) {
        const location = query.location
        const state = location.name.match(/, (\w+)$/)?.[1]

        if (!issQuery.boosts) {
            issQuery.boosts = {}
        }
        issQuery.boosts.location_state = {
            type: "value",
            value: state,
            operation: "multiply",
            factor: 1.5,
        }
        const coordinates = location.coordinates
        if (coordinates) {
            issQuery.boosts.location_approximate_geopoint = [
                {
                    type: "proximity",
                    function: "linear",
                    center: `${coordinates.latitude},${coordinates.longitude}`,
                    factor: 7,
                },
            ]

            issQuery.filters?.all?.push(
                {
                    location_approximate_geopoint: {
                        center:
                            `${coordinates.latitude},${coordinates.longitude}`,
                        distance: 300,
                        unit: "km",
                    },
                }
            )
        }


        // issQuery.boosts.location_postcode = {
        //     type: "value",
        //     value: [
        //         "6009",
        //         "6007",
        //         "6151",
        //         "6008",
        //         "6006",
        //         "6000",
        //         "6004",
        //         "6050",
        //         "6003",
        //         "6005"
        //     ],
        //     "operation": "multiply",
        //     "factor": 2
        // }
    }
    console.log("converting izzy to iss", query, issQuery)

    return issQuery
}


export function convertIzzySearchQueryToIss3(
    query: IzzySearchQuery
): Iss3SearchQuery {
    // age_group: string,
    // area: string,
    // catchment: string,
    // client_gender: string,
    // key: string,
    // limit: number,
    // location: string,
    // minimum_should_match: string,
    // q: string,
    // service_type: string,
    // type: string,
    // site_id?: number,
    // show_in_askizzy_health?: boolean,
    // is_bulk_billing?: boolean
    const issQuery: $Shape<Iss3SearchQuery> = {
    }

    if (query.term) {
        issQuery.q = query.term.join(" ")
    }

    if (query.siteId) {
        issQuery.site_id = query.siteId
    }

    if (query.serviceTypes) {
        issQuery.service_type = query.serviceTypes.map(
            gender => gender.toLowerCase()
        )
    }

    if (query.clientGenders) {
        issQuery.client_gender = query.clientGenders.map(
            gender => ({
                Female: "f",
                Male: "m",
                Diverse: "x",
                unspecified: "u",
            }[gender])
        )
    }

    if (query.ageGroups) {
        issQuery.age_group = query.ageGroups.map(
            gender => gender.toLowerCase()
        )

    }

    if (query.catchment) {
        issQuery.catchment = query.catchment
    }

    if (query.location) {
        issQuery.area = query.location.name
        if (query.location.coordinates) {
            issQuery.location = `${query.location.coordinates.longitude}E` +
                `${query.location.coordinates.latitude}N`
        }
    }
    console.log("converting izzy to iss 3", query, issQuery)

    return issQuery
}
