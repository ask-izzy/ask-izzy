import merge from "deepmerge";
import _ from "underscore";
import {Loader} from "@googlemaps/js-api-loader";

import storage from "@/src/storage.js";
import checkInactive from "@/src/inactiveTimeout.js";
import type {travelTime} from "@/src/iss/general.js"
import {
    GoogleMaps,
    TravelMode,
    GeocoderRequest,
    GeocoderResult,
    AutocompletionRequest,
    AutocompletePrediction,
} from "@/types/interfaces/maps.js"


export class MapsApi {
    api: GoogleMaps;

    constructor(api: GoogleMaps) {
        this.api = api;
    }

    async travelTime(
        destinations: Array<string>,
    ): Promise<Array<travelTime>> {
        // The google maps api authorization requests time out.
        // We've had issues in test (and will likely have in the field)
        // where people go out for lunch+meetings and come back
        // to a non-working page.
        // To resolve this, we reload the page if we've timed out.
        checkInactive();

        if (!destinations.length) {
            return [];
        }

        const drivingRequest = this.batchDirectionsRequest(
            destinations,
            "DRIVING",
        );
        const walkingRequest = this.batchDirectionsRequest(
            destinations,
            "WALKING",
        );
        const transitRequest = this.batchDirectionsRequest(
            destinations,
            "TRANSIT",
        );
        const drivingResults = await drivingRequest;
        const walkingResults = await walkingRequest;
        const transitResults = await transitRequest;

        return _.zip(drivingResults, walkingResults, transitResults)
            .map(([driving, walking, transit]) => {
                const travelTimes: Array<any> = [];

                if (
                    walking.status === "OK" &&
                    walking.distance.value < 5000
                ) {
                    travelTimes.push(walking);
                }
                if (transit.status === "OK") {
                    travelTimes.push(transit);
                }
                if (driving.status === "OK") {
                    travelTimes.push(driving);
                }

                return travelTimes;
            })
    }

    batchDirectionsRequest(
        destinations: Array<string>, mode: TravelMode = "WALKING",
    ): Promise<Array<travelTime>> {
        const directionsService = new (this.api.DistanceMatrixService as any)();
        const coords = storage.getUserGeolocation();
        if (!coords) {
            return new Promise(resolve => resolve([]))
        }

        const params = {
            travelMode: this.api.TravelMode[mode],
            unitSystem: this.api.UnitSystem.METRIC,
            origins: [`${coords.latitude},${coords.longitude}`],
            destinations: destinations,
            transitOptions: {departureTime: new Date()},
        }

        return new Promise((resolve, reject) => {
            directionsService.getDistanceMatrix(
                params,
                (response, status) => {
                    if (status === this.api.DirectionsStatus.OK) {
                        const times = response.rows[0].elements;

                        times.forEach((transportTime) => {
                            transportTime.mode = mode
                        });
                        resolve(times);
                    } else {
                        reject([status, response])
                    }
                },
            )
        });
    }

    /**
     * @param {GeocoderRequest} params - an object of params per the Google
     * Maps JS API.
     *
     * @returns {Promise<Array<GeocoderResult>>} a Promise containing the
     * geocode results.
     */
    geocode(params: GeocoderRequest): Promise<Array<GeocoderResult>> {
        const geocoder = new (this.api.Geocoder as any)();

        return new Promise((resolve, reject) =>
            geocoder.geocode(params, (results, status) => {
                if (status === this.api.GeocoderStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }
            }));
    }

    autocompletePlaces(
        params: AutocompletionRequest,
    ): Promise<Array<AutocompletePrediction>> {
        const autocompleter = new (this.api.places.AutocompleteService as any)();

        return new Promise((resolve, reject) =>
            autocompleter.getPlacePredictions(params, (results, status) => {

                if (status === this.api.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }
            }));
    }
}

let mapsAPIPromise;

/**
 * Request the Google Maps API.
 *
 * Google Maps API is asynchronously loaded from Google. This promise will
 * resolve when it's available. Unfortunately, on problem, instead of being
 * rejected, the user will see an alert.
 *
 * @returns {Promise<MapsApi>} a Promise that will resolve to the Google Maps
 * API, when available.
 */
function maps(): Promise<MapsApi> {
    if (!mapsAPIPromise) {
        const api = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
            libraries: ["places"],
        });
        mapsAPIPromise = api.load().then(google => {
            if (window?.googleMocks) {
                console.log(`Loading ${window.googleMocks.length} mocks`)
                for (const googleMock of window.googleMocks) {
                    // We need to make sure we're not modifying the original
                    // google api object otherwise it our changes won't be reset
                    // between test scenarios
                    google = merge(google, googleMock)
                }
            }
            return new MapsApi(google.maps as any);
        })
    }
    return mapsAPIPromise;
}

export default maps;
