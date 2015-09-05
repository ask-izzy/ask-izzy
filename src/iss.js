/* @flow */

"use strict";

import http from 'iso-http';
import url from 'url';

declare var ISS_URL: string;

export type searchRequest = {
    q?: string,
    service_types?: string | Array<string>,  // jscs:disable
    site_id?: number,  // jscs:disable

    area?: string,
    location?: string,
    type?: string,

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
    objects: Array<issService>,
};

/**
 * request:
 * obj: data passed to http.request
 *
 * Wraps the http request code in a promise.
 *
 * Returns: a promise for the request
 */
function request(obj) {
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

/**
 * search:
 * @query: either a query string, or an object of search parameters
 * @location: (optional but recommended) a search area
 * @coords: (optional) the user's coordinates
 *
 * Execute a search against ISS.
 */
export async function search(
    query: Object | string,
    location: ?string,
    coords: ?{longitude: number, latitude: number},
): Promise<searchResults> {

    var request: searchRequest = {
        type: 'service',
        catchment: true,
        limit: 5,
    };

    if (typeof query === 'string') {
        request.q = query;
    } else if (query instanceof Object) {
        Object.assign(request, query);
    } else {
        throw new Error("query can only be string or object");
    }

    if (location) {
        request.area = location;
    }

    if (coords) {
        request.location = `${coords.longitude}E${coords.latitude}N`;
    }

    return await iss('/api/v3/search/', request);
}

export async function getService(
    id: number
): Promise<issService> {
    return await iss(`/api/v3/service/${id}/`);
}

export async function getSiteChildren(
    siteId: number
): Promise<searchResults> {
    var request: searchRequest = {
        site_id: siteId,
        type: 'service',
    };

    return await iss('/api/v3/search/', request);
}

async function iss(path: string, data: ?searchRequest): Object {
    var url_: string = ISS_URL || process.env.ISS_URL;
    var urlobj: url.urlObj = url.parse(url_ + path, true);

    /* data overrides anything passed in via the URL.
     * Passing query args via the URL needs to be supported for requesting
     * meta.next */
    data = Object.assign({}, urlobj.query, data);
    data.key = urlobj.auth;

    urlobj.auth = urlobj.search = urlobj.querystring = urlobj.query = null;
    url_ = url.format(urlobj);

    console.log("URL", url_);
    console.log("Data", data);

    var response = await request({
        url: url_,
        contentType: 'application/json',
        headers: {Accept: 'application/json'},
        data: data,
    });

    return JSON.parse(response.text);
}

export default iss;
