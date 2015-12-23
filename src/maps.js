/* @flow */

declare var google: Google;

import storage from "./storage";
import _ from "underscore";

class MapsApi {
    api: GoogleMaps;

    constructor(api: Object) {
        this.api = api;
    }

    async travelTime(
        destinations: Array<string>
    ): Promise<Array<travelTime>> {
        if (!destinations.length) {
            return [];
        }

        const walkingRequest = this.batchDirectionsRequest(
            destinations,
            "WALKING",
        );
        const transitRequest = this.batchDirectionsRequest(
            destinations,
            "TRANSIT",
        );
        const walkingResults = await walkingRequest;
        const transitResults = await transitRequest;

        return _.zip(walkingResults, transitResults)
            .map(([walking, transit]) => {
                if (transit.status != "OK") {
                    // Transit had no result; use walking directions
                    return walking;
                } else {
                    if (walking.status != "OK") {
                        // Walking had no result; use transit directions
                        return transit;
                    } else {
                        // Both modes had results; return the faster one.
                        if (walking.duration.value >
                            transit.duration.value) {
                            return transit;
                        } else {
                            return walking;
                        }
                    }
                }
            }
        )
    }

    batchDirectionsRequest(
        destinations: Array<string>, mode = "WALKING"
    ): Promise<Array<travelTime>> {
        const directionsService = new this.api.DistanceMatrixService();
        const coords = storage.coordinates;
        let origin = storage.location;

        if (coords && coords.latitude && coords.longitude) {
            origin = `${coords.latitude},${coords.longitude}`;
        }

        const params = {
            travelMode: this.api.TravelMode[mode],
            unitSystem: this.api.UnitSystem.METRIC,
            origins: [`${origin}`],
            destinations: destinations,
        }

        return new Promise((resolve, reject) => {
            directionsService.getDistanceMatrix(
                params,
                (response, status) => {
                    if (status == this.api.DirectionsStatus.OK) {
                        let times = response.rows[0].elements;

                        times.forEach((transportTime) =>
                            transportTime.mode = mode
                        );
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
                    reject(status, results);
                }
            }));
    }

    autocompletePlaces(
        params: AutocompletionRequest
    ): Promise<Array<AutocompletePrediction>> {
        let autocompleter = new this.api.places.AutocompleteService();

        return new Promise((resolve, reject) =>
            autocompleter.getPlacePredictions(params, (results, status) => {

                if (status == this.api.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(status, results);
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
function maps(): Promise<MapsApi> {
    return new Promise((resolve, reject) => {
        function checkLoaded() {
            try {
                // Check that google maps has loaded
                google.maps.DistanceMatrixService.name;

                resolve(new MapsApi(google.maps));
            } catch (error) {
                /* try again in 500ms */
                setTimeout(checkLoaded, 500);
            }
        }

        checkLoaded();
    });
}

export default maps;
