/* @flow */
/**
 * ISS API functions.
 *
 * @module iss
 */

import xhr from "axios";
import url from "url";
import { slugify } from "underscore.string";
import _ from "underscore";
import lru from "lru-cache";

import sendEvent from "./google-tag-manager";
import ServiceOpening from "./iss/ServiceOpening";
import Location from "./iss/Location";
import Cache from "./iss/Cache";
import serviceProvisions from "./constants/service-provisions";
import Maps from "./maps";

declare var ISS_URL: string;

export type searchResultMerger = (
    original: searchResults,
    alternate: searchResults
) => searchResults;

export type searchRequest = {
    q?: string,
    service_type?: Array<string>,
    site_id?: number,

    minimum_should_match?: string,

    area?: string,
    location?: string,
    type?: string,
    age_groups?: Array<string>,
    client_gender?: Array<string>,

    catchment?: boolean|string,
    is_bulk_billing?: boolean,
    healthcare_card_holders?: boolean,

    limit?: number,
    key?: string,

    _multi?: {
        alternate: (x: searchRequest) => searchRequest,
        merge: searchResultMerger,
    }
};

type searchResultsLocation = {
    name: string,
    suburb: string,
    state: string,
    lat: number,
    lon: number,
};

type searchResultsMeta = {
    total_count: number,
    available_count: number,
    limit: number,
    offset: number,

    previous: ?string,
    next: ?string,

    location: searchResultsLocation,
};

export type searchResults = {
    meta: searchResultsMeta,
    objects: Array<Service>,
};

type XhrOptions = {
    url: string,
    method?: string,
    timeout?: number,
    headers?: Object,
    body?: ?string,
    json?: any,
    username?: string,
    password?: string,
    withCredentials?: boolean,
    responseType?: string,
    beforeSend?: Function,
};

let xhrInProgress = 0;

if (typeof window != "undefined") {
    window.xhrCount = () => xhrInProgress;
}

/**
 * Wraps the http request code in a promise.
 *
 * @param {Object} obj - data passed to http.request.
 *
 * @returns {Promise<Object>} a promise for the request.
 */
async function _request(obj: XhrOptions) {
    xhrInProgress++;
    try {
        return await xhr(obj);
    } catch (error) {
        sendEvent({
            event: "xhr_failed",
            error: JSON.stringify(error),
        });
        throw error;
    } finally {
        xhrInProgress--;
    }
}

/**
 * Add anything in data to the URL query params,
 * and convert auth to `&key=value` form.
 *
 * @param {string} url_ - The URL to add to.
 * @param {Object} data - data passed to http.request.
 *
 * @returns {Promise<Object>} a promise for the request.
 */
export function mungeUrlQuery(url_: string, data: ?Object): string {
    /* https://github.com/facebook/flow/issues/908 */
    let urlObj: any = /*::`*/url.parse(url_, true)/*::`*/;

    /* data overrides anything passed in via the URL.
     * Passing query args via the URL needs to be supported for requesting
     * meta.next */
    data = Object.assign({}, urlObj.query, data);
    if (urlObj.auth) {
        data.key = urlObj.auth;
    }

    urlObj.auth = urlObj.search = urlObj.query = null;
    url_ = url.format(urlObj);

    /*
     * Encode data into the URI ourselves
     * until we can work around
     * https://github.com/jedmao/iso-http/issues/2
    */
    let serialized = "";

    if (data) {
        // Flow can't tell that `data` isn't null inside a closure
        let _data = data;

        serialized = Object.keys(_data).sort().map(key => {
            let serializeValue = (value) =>
                `${key}=${encodeURIComponent(value)}`;

            if (Array.isArray(_data[key])) {
                return _data[key].map(serializeValue).join("&");
            } else {
                return serializeValue(_data[key]);
            }
        }).join("&");
    }

    let joiner = (url_.indexOf("?") > -1) ? "&" : "?";

    return url_ + joiner + serialized;
}

export async function request(
    path: string,
    data: ?searchRequest
): Promise<Object> {
    const url_ = mungeUrlQuery(url.resolve(ISS_URL, path), data);

    let response = await _request({
        url: url_,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    });

    return response.data;
}

/*
 * Loads the transportTime property from google
 * and adds it to the given Service instances
 */
async function attachTransportTimes(
    services: Array<Service>
): Promise<Array<Service>> {
    if (typeof window == "undefined") {
        // Google maps api doesn't work outside the browser.
        return services;
    }

    let formatPoint = (point) => `${point.lat},${point.lon}`;
    const maps = await Maps();
    let service: ?Service;
    let travelTimes = await maps.travelTime([/*::`*/
        for (service of services)
        if (!service.Location().isConfidential())
        formatPoint(service.location.point)
    /*::`*/]);

    for (service of services) {
        if (!service.Location().isConfidential()) {
            service.travelTime = travelTimes.shift();
        }
    }

    return services;
}

let requestObjectsCache = new Cache();
let serviceCache = lru({
    max: 150, // Only track 150 keys in the cache
    maxAge: 1000 * 60 * 60, // Discard anything over 1 hour
});

if (typeof window != "undefined") {
    window.IzzyRequestObjectsCache = requestObjectsCache;
    window.IzzyServiceCache = serviceCache;
}

export async function requestObjects(
    path: string,
    data: ?searchRequest,
): Promise<searchResults> {
    const url_ = mungeUrlQuery(path, data);
    const hit = requestObjectsCache.exactHit(url_);

    if (hit) {
        return hit;
    }

    let response = await request(path, data);

    // convert objects to ISS search results
    const objects = response.objects.map(
        (object: issService): Service => new Service(object)
    );

    response.objects = await attachTransportTimes(objects);

    response.objects.forEach((service) =>
        serviceCache.set(service.id, service)
    )
    requestObjectsCache.revise(url_, response);

    return response;
}

export class Service {
    constructor(props: issService) {
        if (!props.location) {
            props.location = {
                "building": "",
                "flat_unit": "",
                "level": "",
                "postcode": "",
                "state": "",
                "street_name": "",
                "street_number": "",
                "street_suffix": "",
                "street_type": "",
                "suburb": "",
            };
        }

        // until we upgrade past flow 0.22.1 and
        // get smarter refinements
        // for missing properties: flow:disable
        Object.assign(this, props);
    }

    Location(): Location {
        return new Location(this.location, this.travelTime);
    }

    Phones(): Array<phone> {
        const phoneKinds = ["freecall", "phone", "mobile"];

        return _(_(this.phones
            .filter(({kind}) => phoneKinds.includes(kind))
            .map(({comment, kind, number}) => {
                // 13* lines are not free calls
                if ((kind == "freecall") && (number.match(/^13/))) {
                    kind = "phone";
                }

                return {
                    comment: (comment || "").trim(),
                    kind: (kind || "").trim(),
                    number: (number || "").trim(),
                }
            }))
            .sortBy((({kind}) => phoneKinds.indexOf(kind))))
            .uniq(phone => phone.number);
    }

    abn: string;
    accessibility: issAccessibility;
    accessibility_details: string;
    accreditation: Array<string>;
    age_groups: Array<issAgeGroup>;
    also_known_as: Array<string>;
    assessment_criteria: string;
    availability: string;
    billing_method: string;
    capacity: {
        status: string;
        status_text: string;
    };
    catchment: string;
    cost: string;
    crisis: boolean;
    description: string;
    eligibility_info: string;
    emails: Array<{
        comment: string;
        email: email,
    }>;
    endpoints: Array<endpoint>;
    funding_body: string;
    healthcare_card_holders: boolean;
    id: number;
    ineligibility_info: string;
    intake_info: string;
    intake_point: string;
    is_bulk_billing: boolean;
    languages: Array<string>;
    last_updated: ymdWithDashesDate;
    location: issLocation;
    travelTime: ?travelTime; // From google travel times api
    name: string;
    ndis_approved: boolean;
    now_open: issNowOpen;
    opening_hours: Array<issOpeningHours>;
    parking_info: string;
    phones: Array<phone>;
    postal_address: Array<{
        line1: string,
        line2: string,
        postcode: string,
        state: state,
        suburb: string,
    }>;
    public_transport_info: string;
    referral_info: string;
    service_types: Array<string>;
    site: {
        id: number,
        name: string,
        organisation: {
            id: number,
            name: string,
        },
    };
    special_requirements: string;
    target_gender: issGender;
    type: issEntityType;
    web: urlString;

    _serviceProvisions: Array<string>;
    _siblingServices: searchResults;


    /**
     * The service opening hours
     */
    get open(): (ServiceOpening) {
        return new ServiceOpening(this);
    }

    descriptionSentences(): Array<string> {
        return this.description.split(". ")
            .filter(str => str.trim())
            .map(str => (str.trim() + ".").replace("..", "."))
    }

    /**
     * First part of the description.
     */
    get shortDescription(): Array<string> {
        let sentences = this.descriptionSentences();
        let description = [sentences.shift()];
        let descriptionLength = () =>
            description.reduce((memo, elem) => memo + elem.length, 0);

        while (sentences.length && descriptionLength() < 250) {
            description.push(sentences.shift());
        }

        return description;
    }

    /**
     * Rest of the description after the shortDescription.
     */
    get descriptionRemainder(): Array<string> {
        return this.descriptionSentences().slice(
            this.shortDescription.length
        );
    }

    /**
     * An array of things this service provides built using a bucket-of-words
     * approach from the service's full description */
    get serviceProvisions(): Array<string> {
        if (this._serviceProvisions) {
            return this._serviceProvisions;
        }

        try {
            this._serviceProvisions = [
                /*::`*/
                for (provision of serviceProvisions)
                if (provision.match(this.description))
                provision.name
                /*::`*/
            ];
        } catch (error) {
            console.error("Failed to determine service provisions", error);
            this._serviceProvisions = [];
        }

        return this._serviceProvisions;
    }

    async getSiblingServices(): Promise<searchResults> {
        if (this._siblingServices) {
            return this._siblingServices;
        }

        let request_: searchRequest = {
            site_id: this.site.id,
            type: "service",
            limit: 0,
        };
        let {objects, meta} = await requestObjects(
            "/api/v3/search/",
            request_
        );

        // Don't mutate what comes back from
        // requestObjects - the objects are cached!
        this._siblingServices = {
            meta,
            objects: objects.filter(service => service.id != this.id),
        };

        return this._siblingServices;
    }

    get slug(): string {
        return slugify(`${this.id}-${this.site.name}`);
    }
}

/**
 * Execute a search against ISS.
 *
 * @param {searchRequest} query - either a query string, or an object of
 * search parameters.
 * @param {?string} location (optional but recommended) - a search area.
 * @param {?Object} coords (optional) - the user's coordinates.
 *
 * @returns {Promise<searchResults>} search results from ISS.
 */
async function _search(
    query: searchRequest,
): Promise<searchResults> {
    let request_: searchRequest = {
        q: "",
        type: "service",
        limit: 10,
        catchment: "prefer",
    };

    Object.assign(request_, query);
    try {
        return await requestObjects("/api/v3/search/", request_);
    } catch (error) {
        if (error && error[0] == "OVER_QUERY_LIMIT") {
            console.log("Rate limited by ISS - backing off for 4 seconds");
            await wait(4000);
            return search(query);
        }

        if (error &&
            error.data &&
            error.data.error_message == "Elasticsearch request timed out"
        ) {
            await wait(500);
            return search(query);
        }

        throw error;
    }
}

export async function search(
    query: searchRequest,
): Promise<searchResults> {
    if (query._multi) {
        const {_multi, ...base} = query;

        const baseQuery = _search(base);
        const alternateQuery = _search(_multi.alternate(base));

        return _multi.merge(
            await baseQuery,
            await alternateQuery
        );
    } else {
        return await _search(query);
    }
}

function wait(
    milliseconds: number,
): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, milliseconds);
    });
}

export async function getService(
    id: number
): Promise<Service> {
    let cached = serviceCache.get(id);

    if (cached) {
        return cached;
    }

    const response = await request(`/api/v3/service/${id}/`);
    const service = new Service(response);

    await attachTransportTimes([service]);
    return service;
}

export function countCrisisResults(results: Array<Service>): number {
    const firstRegularServiceIdx = results.findIndex(
        ({crisis}) => !crisis
    )

    if (firstRegularServiceIdx === -1) {
        // No regular services found; everything is a crisis service
        return results.length
    } else {
        // Anything after the first regular service is not a crisis result
        return firstRegularServiceIdx;
    }
}

export function crisisResults(results: Array<Service>): Array<Service> {
    return results.slice(
        0,
        countCrisisResults(results)
    );
}

export function nonCrisisResults(results: Array<Service>): Array<Service> {
    return results.slice(
        countCrisisResults(results),
        results.length
    )
}

export default {
    search: search,
    getService: getService,
    request: request,
    requestObjects: requestObjects,
    Service: Service,
};
