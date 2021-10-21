/* @flow */

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
