/* @flow */

declare var google: Google;

import storage from "./storage";
import _ from "underscore";
import checkInactive from "./inactiveTimeout";
import {wait} from "./utils"

export class MapsApi {
    api: GoogleMaps;

    constructor(api: GoogleMaps) {
        this.api = api;
    }

    async travelTime(
        destinations: Array<string>
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
                let travelTimes = [];

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
            }
            )
    }

    batchDirectionsRequest(
        destinations: Array<string>, mode: TravelMode = "WALKING"
    ): Promise<Array<travelTime>> {
        const directionsService = new this.api.DistanceMatrixService();
        const coords = storage.getCoordinates();
        let origin = storage.getLocation();

        if (coords && coords.latitude && coords.longitude) {
            origin = `${coords.latitude},${coords.longitude}`;
        }

        const params = {
            travelMode: this.api.TravelMode[mode],
            unitSystem: this.api.UnitSystem.METRIC,
            origins: [`${origin}`],
            destinations: destinations,
            transitOptions: {departureTime: new Date()},
        }

        return new Promise((resolve, reject) => {
            directionsService.getDistanceMatrix(
                params,
                (response, status) => {
                    if (status === this.api.DirectionsStatus.OK) {
                        let times = response.rows[0].elements;

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
        let geocoder = new this.api.Geocoder();

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
        params: AutocompletionRequest
    ): Promise<Array<AutocompletePrediction>> {
        let autocompleter = new this.api.places.AutocompleteService();

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
export default async function(): Promise<MapsApi> {
    // Wait until google maps has loaded
    while (!google?.maps?.DistanceMatrixService?.name) {
        await wait(50)
    }
    return new MapsApi(google.maps)
}
