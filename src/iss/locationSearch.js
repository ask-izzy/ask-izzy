/* @flow */
import type {searchResultsMeta} from "./search"
import {jsonRequestFromIss} from "./request"

export type areaLocation = {
    name: string,
    kind: string,
    postcode: string,
    state: string,
    suburb: string,
}

export type locationSearchRequest = {
    name: string,
    kind: Array<string>,
}

export type locationSearchResults = {
    meta: searchResultsMeta,
    objects: Array<areaLocation>,
}

/**
 * Autocomplete locations from ISS.
 *
 * @param {searchRequest} where - the input so far
 *
 * @returns {Promise<searchLocations>} location results from ISS.
 */
export async function searchForLocations(
    where: string,
): Promise<locationSearchResults> {
    return await jsonRequestFromIss("/api/v3/location/search/", {
        name: where,
        kind: ["postcode", "suburb", "town"],
    });
}
