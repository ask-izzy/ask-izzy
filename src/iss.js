/* @flow */
/**
 * ISS API functions.
 *
 * @module iss
 */

import xhr from "xhr";
import url from "url";
import { slugify } from "underscore.string";
import ServiceOpening from "./iss/ServiceOpening";
import Location from "./iss/Location";
import serviceProvisions from "./constants/service-provisions";
import Maps from "./maps";

declare var ISS_URL: string;

/* eslint-disable no-use-before-define */

export type searchRequest = {
    q?: string,
    service_types?: string | Array<string>,
    site_id?: number,

    area?: string,
    location?: string,
    type?: string,
    age_groups?: Array<string>,
    client_gender?: Array<string>,

    catchment?: boolean,
    is_bulk_billing?: boolean,
    healthcare_card_holders?: boolean,

    limit?: number,
    key?: string,
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
    useXDR?: boolean,
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

/**
 * Wraps the http request code in a promise.
 *
 * @param {Object} obj - data passed to http.request.
 *
 * @returns {Promise<Object>} a promise for the request.
 */
function _request(obj: XhrOptions) {
    return new Promise((resolve, reject) =>
        xhr(obj, (err, response, body) => {
            if (response.statusCode == 200) {
                resolve(response);
            } else {
                reject(response);
            }
        })
    );
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
export function mungeUrlQuery(url_: string, data: Object): string {
    let urlObj = url.parse(url_, true);

    /* data overrides anything passed in via the URL.
     * Passing query args via the URL needs to be supported for requesting
     * meta.next */
    data = Object.assign({}, urlObj.query, data);
    if (urlObj.auth) {
        data.key = urlObj.auth;
    }

    urlObj.auth = urlObj.search = urlObj.query = null;
    /* flow:disable https://github.com/facebook/flow/issues/908 */
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

        serialized = Object.keys(_data).map(key => {
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
    let url_: string = ISS_URL;

    /* flow:disable https://github.com/facebook/flow/issues/908 */
    url_ = mungeUrlQuery(url.resolve(url_, path), data);
    let response = await _request({
        useXDR: true,
        url: url_,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    });

    return JSON.parse(response.body);
}

/*
 * Loads the transportTime property from google
 * and adds it to the given Service instances
 */
async function attachTransportTimes(
    services: Array<Service>
): Promise<Array<Service>> {
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

export async function requestObjects(
    path: string,
    data: ?searchRequest,
): Promise<searchResults> {
    let response = await request(path, data);

    // convert objects to ISS search results
    const objects = response.objects.map(
        (object: issService): Service => new Service(object)
    );

    response.objects = await attachTransportTimes(objects);
    return response;
}

export class Service {
    constructor(props: issService) {
        Object.assign(this, props);
    }

    Location(): Location {
        return new Location(this.location, this.travelTime);
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
    now_open: {
        local_time: hmsWithColonsTime,
        notes: string,
        now_open: ?boolean,
    };
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
    /* flow:disable */
    get open(): (ServiceOpening) {
        return new ServiceOpening(this);
    }

    /**
     * First sentence of the description.
     */
    /* flow:disable */
    get shortDescription(): string {
        return this.description.split(".", 1)[0] + ".";
    }
    /**
     * An array of things this service provides built using a bucket-of-words
     * approach from the service's full description */
    /* flow:disable */
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

        this._siblingServices = await requestObjects("/api/v3/search/",
                                                     request_);

        this._siblingServices.objects =
            this._siblingServices.objects.filter(
                service => service.id != this.id
        );


        return this._siblingServices;
    }

    /* flow:disable */
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
export async function search(
    query: Object | string,
    location: ?string,
    coords: ?{longitude: number, latitude: number},
): Promise<searchResults> {

    let request_: searchRequest = {
        q: "",
        type: "service",
        catchment: true,
        limit: 10,
    };

    if (typeof query === "string") {
        /* eslint-disable id-length */
        request_.q = query;
    } else if (query instanceof Object) {
        Object.assign(request_, query);
    } else {
        throw new Error("query can only be string or object");
    }

    if (location) {
        request_.area = location;
    }

    if (coords) {
        request_.location = `${coords.longitude}E${coords.latitude}N`;
    }

    let response = await requestObjects("/api/v3/search/", request_);

    return response;
}

export async function getService(
    id: number
): Promise<Service> {
    const response = await request(`/api/v3/service/${id}/`);
    const service = new Service(response);

    await attachTransportTimes([service]);
    return service;
}

export default {
    search: search,
    getService: getService,
    request: request,
    requestObjects: requestObjects,
    Service: Service,
};
