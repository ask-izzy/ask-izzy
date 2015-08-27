/* @flow */

"use strict";

import http from 'iso-http';
import url from 'url';

declare var ISS_URL: string;

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

export async function search(
    location: string,
    coords: ?{longitude: number, latitude: number},
    query: string
): Promise<{
    objects: Array<issService>,
    meta: string,
}> {
    var request = {
        q: query,
        type: 'service',
        area: location,
        location: null,
        catchment: true,
        limit: 3,
    };
    if (coords) {
        request.location = `${coords.longitude}E${coords.latitude}N`;
    }

    return await iss('search/', request);
}

async function iss(path: string, data: ?Object): Object {
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
