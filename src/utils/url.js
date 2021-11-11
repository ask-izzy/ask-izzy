/* @flow */
import url from "url";

/**
 * Add anything in data to the URL query params,
 * and convert auth to `&key=value` form.
 *
 * @param {string} url_ - The URL to add to.
 * @param {Object} data - data passed to http.request.
 *
 * @returns {Promise<Object>} a promise for the request.
 */
export function serialiseUrlQueryParams(url_: string, data: ?Object): string {
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

export const replaceUrlLocation = (
    location: string,
    parts: Array<string>,
): Array<string> => {
    // Rewrites a URL consisting of parts based on provided location.
    const newUrlLocation = location
        .split(", ")
        .map(encodeURIComponent)
        .join("-");

    // If URL has suburb, replace the existing suburb.
    // Do not replace if the url looks to include a '-' as
    // part of the ISS search query.
    if (parts.length > 3 &&
            parts[3].includes("-") &&
            !parts[3].includes(" -") &&
            !parts[3].includes("%20-")
    ) {
        parts.splice(3, 1, newUrlLocation)
    } else if (parts.length > 2 &&
            parts[2].includes("-") &&
            !parts[2].includes(" -") &&
            !parts[2].includes("%20-")
    ) {
        parts.splice(2, 1, newUrlLocation)
    } else {
        // We didn't find any suburb
        // just add the new location to the url
        if (parts[1].includes("search")) {
            parts.splice(3, 0, newUrlLocation)
        } else {
            parts.splice(2, 0, newUrlLocation)
        }
    }
    return parts;
}

/** Takes a route path and substitutes in param values
 *
 * @param {string} path - A path with colon-formatted params.
 * @param {Object} params - Params to insert into the path.
 *
 * @returns {string} - The path with params values inserted.
 */
export function fillInPathParams(
    path: string,
    params: {[string]: string}
): string {
    return path.replace(
        /:\w+/g,
        part => part.substring(1) in params ?
            params[part.substring(1)] || ""
            : part
    ).replace(/\/{2,}/g, "/")
}
