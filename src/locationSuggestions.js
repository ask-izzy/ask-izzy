/* @flow */

import _ from "underscore";
import Maps from "./maps";
import storage from "./storage";

type LocationCompletion = {
    "suburb": string,
    "state": string,
}

type GoogleCompletion = {
    "types": Array<string>,
    "terms": Array<{value: string}>,
}

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
): Promise<Array<LocationCompletion>> {
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

    // flow:disable no generators
    return [
        /*::{_:`*/
        for (completion of injectSuffixes(filterCompletions(completions)))
            completion
        /*::`}*/
    ];
}

function *filterCompletions(
    completions: Iterable<GoogleCompletion>
): Iterable<LocationCompletion> {
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

const majorCitySuffixes = {
    "Sydney, New South Wales": "CBD",
    "Melbourne, Victoria": "CBD",
    "Brisbane, Queensland": "CBD",
    "Perth, Western Australia": "CBD",
    "Adelaide, South Australia": "CBD",
    "Newcastle, New South Wales": "City",
    "Canberra, Australian Capital Territory": "City",
    "Wollongong, New South Wales": "City",
    "Hobart, Tasmania": "CBD",
    "Geelong, Victoria": "City",
    "Townsville, Queensland": "City",
    "Cairns, Queensland": "City",
    "Darwin, Northern Territory": "City",
    "Toowoomba, Queensland": "City",
}

function *injectSuffixes(
    completions: Iterable<LocationCompletion>
): Iterable<LocationCompletion> {
    // flow:disable no generators
    const completionArray: Array<LocationCompletion> = [
        /*::{_:`*/
        for (completion of completions)
            completion
        /*::`}*/
    ];

    for (const completion of completionArray) {
        const suffix = majorCitySuffixes[
            `${completion.suburb}, ${completion.state}`
        ]

        if (suffix) {
            const extra = {
                suburb: `${completion.suburb} ${suffix}`,
                state: completion.state,
            };

            // If this version shows up later, remove it.
            const existingExtra = _(completionArray).find(({suburb, state}) =>
                (suburb == extra.suburb) && (state == extra.state)
            );

            if (existingExtra) {
                completionArray.splice(
                    completionArray.indexOf(existingExtra),
                    1
                );
            }

            yield extra;
        }
        yield completion;
    }
}

export {injectSuffixes as injectSuffixes};
export {filterCompletions as filterCompletions};
