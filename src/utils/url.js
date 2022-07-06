/* @flow */

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

export function ensureURLHasTrailingSlash(url: string): string {
    return url.replace(/\/*$/, "/")
}
