/* @flow */
import xhr from "axios";
import url from "url";

import {getIssClient} from "./client"

import {
    ReturnAfter,
} from "../timeout";
import * as gtm from "../google-tag-manager";
import {serialiseUrlQueryParams} from "../utils/url"

import storage from "../storage"

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

    console.log('-', requestUrl, url.resolve(window.ISS_URL, urlPath), data)

    // let response = await requestFromIss({
    //     url: requestUrl,
    //     headers: {
    //         "Content-type": "application/json",
    //         Accept: "application/json",
    //     },
    // });


    const location = storage.getLocation()

    console.log('fire', location, location.latitude)

    console.info({geopointString})




    const iss4Res = await getIssClient()


    console.log('blar', iss4Res)

    const res = {
        meta: {
            available_count: iss4Res.meta.page.total_results,
            limit: iss4Res.meta.page.size,
            location: {
                lat: -33.867793,
                lon: 151.207729,
                name: "Sydney",
                state: "NSW",
                suburb: "Sydney"
            },
            next: "/api/v3/search/?area=Sydney%2C+NSW&catchment=prefer&key=UNDFUUWCHWGIJGTGMTBXZJDENAACETNJ%3AXBKSEBMIGVELOOSTGZFEJHKZWCKAFZUY&minimum_should_match=30%25&q=housing+-%28coordinating+bodies%29+-%28respite+care%29+-%28housing+information%29+-hef+-%28holiday+accommodation%29&service_type=housing&type=service&limit=10&offset=10",
            offset: iss4Res.meta.page.size * (iss4Res.meta.page.current - 1),
            total_count: iss4Res.meta.page.total_results,
        },
        objects: iss4Res.results
    }

    for (const service of res.objects) {
        service.now_open = {
            local_time: "2022-01-18T16:41:00+11:00",
            notes: "",
            now_open: true,
        }
        service.catchment = service.catchment_description
    }

    console.log('***', res)

    return res
}
