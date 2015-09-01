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
): Promise<{
    objects: Array<issService>,
    meta: Object,
}> {

    var request: searchRequest = {
        type: 'service',
        catchment: true,
        limit: 3,
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

    return await iss('search/', request);
}

export async function getService(
    id: number
): Promise<issService> {
    return await iss(`service/${id}/`);
}

async function iss(path: string, data: ?searchRequest): Object {
    var url_: string = ISS_URL || process.env.ISS_URL;

    data = data || {};

    var urlobj: Object = url.parse(url_);
    data.key = urlobj.auth;

    urlobj.auth = null;
    urlobj.pathname = `/api/v3/${path}`;
    url_ = url.format(urlobj);

    var response = await request({
        url: url_,
        contentType: 'application/json',
        headers: {Accept: 'application/json'},
        data: data,
    });

    return JSON.parse(response.text);
}

export default iss;
