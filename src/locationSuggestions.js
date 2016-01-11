/* @flow */

import _ from "underscore";
import Maps from "./maps";
import storage from "./storage";

/**
 * Take a search string and (optionally) the user's current location
 * and return a promise for an array of possible matches.
 *
 * @param {string} input - input text
 * @param {?Object} location - location information
 * @returns {Promise<Array<Object>>} array of possible locations
 */
export default async function suggest(
    input: string,
    location: ?Object,
): Promise<Array<Object>> {
    const maps = await Maps();
    let request: AutocompletionRequest = {
        input: input,
        types: ["geocode"],
        componentRestrictions: {
            country: "au",
        },
    };

    /* If the user has coordinates set in this session, use them */
    location = storage.getCoordinates();
    if (location && location.latitude && location.longitude) {
        request.location = new maps.api.LatLng(location.latitude,
                                               location.longitude);
        request.radius = 10000;  /* 10 km */
    }

    let completions = await maps.autocompletePlaces(request);

    return [
        /*::{_:`*/
        for (completion of filterCompletions(completions))
            completion
        /*::`}*/
    ];
}

function *filterCompletions(completions: Array<Object>): Iterable<Object> {
    for (const completion of completions) {
        if (_.contains(completion.types, "locality")) {
            yield {
                suburb: completion.terms[0].value,
                state: completion.terms[1].value,
            }
        } else if (_.contains(completion.types, "postal_code")) {
            yield {
                state: completion.terms[0].value,
                suburb: completion.terms[1].value,
            }
        }
    }
}
