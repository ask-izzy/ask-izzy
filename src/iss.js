/**
 * ISS API functions.
 *
 * @module iss
 */
/* @flow */

import http from "iso-http";
import url from "url";
import { slugify } from "underscore.string";
import ServiceOpening from "./iss/ServiceOpening";
import serviceProvisions from "./constants/service-provisions";

declare var ISS_URL: string;

/* eslint-disable no-use-before-define */

export type searchRequest = {
    q?: string,
    service_types?: string | Array<string>,  // jscs:disable
    site_id?: number,  // jscs:disable

    area?: string,
    location?: string,
    type?: string,
    age_groups?: Array<string>,

    catchment?: boolean,

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

/**
 * Wraps the http request code in a promise.
 *
 * @param {Object} obj - data passed to http.request.
 *
 * @returns {Promise<Object>} a promise for the request.
 */
function _request(obj) {
    return new Promise((resolve, reject) => {
        http.request(obj, response => {
            if (response.status == 200) {
                resolve(response);
            } else {
                reject(response);
            }
        });
    });
}

export async function request(path: string, data: ?searchRequest): Object {
    var url_: string = ISS_URL || process.env.ISS_URL;
    var urlobj: url.urlObj = url.parse(url.resolve(url_, path), true);

    /* data overrides anything passed in via the URL.
     * Passing query args via the URL needs to be supported for requesting
     * meta.next */
    data = Object.assign({}, urlobj.query, data);
    data.key = urlobj.auth;

    urlobj.auth = urlobj.search = urlobj.querystring = urlobj.query = null;
    url_ = url.format(urlobj);

    var response = await _request({
        url: url_,
        contentType: "application/json",
        headers: {
            Accept: "application/json",
        },
        data: data,
    });

    return JSON.parse(response.text);
}

export async function requestObjects(
    path: string, data: ?searchRequest
): Promise<searchResults> {
    var response = await request(path, data);

    // convert objects to ISS search results
    response.objects = response.objects.map(
        object => Object.assign(new Service(), object)
    );

    return response;
}

export class Service {
    constructor(props: issService) {
        Object.assign(this, props);
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
    location: {
        building: string,
        flat_unit: string,
        level: string,
        point: {
            lat: number,
            lon: number,
        },
        postcode: string,
        state: state,
        street_name: string,
        street_number: string,
        street_suffix: string,
        street_type: string,
        suburb: string,
    };
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

        var request_: searchRequest = {
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

    /** If there is no point value, that means it's being suppressed */
    /* flow:disable */
    get isConfidential(): Boolean {
        return !Boolean(this.location.point);
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

    var request_: searchRequest = {
        type: "service",
        catchment: true,
        limit: 5,
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

    var response = await requestObjects("/api/v3/search/", request_);

    return response;
}

export async function getService(
    id: number
): Promise<Service> {
    var response = await request(`/api/v3/service/${id}/`);

    return new Service(response);
}

export default {
    search: search,
    getService: getService,
    request: request,
    requestObjects: requestObjects,
    Service: Service,
};
