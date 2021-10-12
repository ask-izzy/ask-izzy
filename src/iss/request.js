/* @flow */
import xhr from "axios";
import url from "url";

import {
    ReturnAfter,
} from "../timeout";
import * as gtm from "../google-tag-manager";
import {serialiseUrlQueryParams} from "../utils/url"

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

/**
 * Wraps the http request code in a promise.
 *
 * @param {Object} obj - data passed to http.request.
 *
 * @returns {Promise<Object>} a promise for the request.
 */
export async function requestFromIss(obj: XhrOptions): Object {
    try {
        return await xhr(obj);
    } catch (error) {
        // Axios errors include config / request keys which
        // cannot be JSON-ified.
        const {data, status, statusText, headers} = error;

        if (status === 429) {
            console.log("Rate limited by ISS - backing off for 4 seconds");
            await ReturnAfter(4000, null);
            return xhr(obj);
        }

        if (status === 504) {
            console.log("ISS has gateway timeout - retrying");
            await ReturnAfter(500, null);
            try {
                return await xhr(obj);
            } catch (error) {
                // perform query to failover URL where catchment=true
                obj.url = obj.url.replace("catchment=prefer",
                    "catchment=true");
                try {
                    return await xhr(obj);
                } catch (error) {
                    await ReturnAfter(500, null);
                    return xhr(obj);
                }
            }
        } else if (status >= 502) {
            console.log("ISS or elasticsearch are down - retrying");
            await ReturnAfter(500, null);
            return xhr(obj);
        }

        gtm.emit({
            event: "Network Error",
            eventCat: "Error Occurred",
            eventAction: "Network",
            eventLabel: JSON.stringify({data, status, statusText, headers}),
            sendDirectlyToGA: true,
        });

        throw error;
    }
}

export async function jsonRequestFromIss(
    urlPath: string,
    data: ?{}
): Promise<Object> {
    const requestUrl = serialiseUrlQueryParams(
        url.resolve(window.ISS_URL, urlPath),
        data
    );

    let response = await requestFromIss({
        url: requestUrl,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    });

    return response.data;
}
