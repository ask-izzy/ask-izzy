/* @flow */

declare var google: Google;

import {decorateDebounceWithPromise} from "./debounce-with-promise";
import storage from "./storage";

class MapsApi {
    api: GoogleMaps;

    constructor(api: Object) {
        this.api = api;
    };

    // Mixin converts arguments into Array<Array<arguments>>
    // FIXME: Mixin should instead convert into Array<arg1>, Array<arg2>
    @decorateDebounceWithPromise(10, false)
    batchDirectionsRequest(requests: Array<Array<string>>|string): Promise<Object> {
        if (typeof requests == 'string') {
            throw new Error("Expected mixin to convert string to array")
        }
        const destinations = requests.map((args) => args[0]);
        let directionsService = new this.api.DistanceMatrixService();

        const coords = storage.getJSON("coordinates");
        let origin = storage.getItem("location");

        if (coords && coords.latitude && coords.longitude) {
            origin = `${coords.latitude},${coords.longitude}`;
        }

        let params = {
            travelMode: this.api.TravelMode.WALKING,
            unitSystem: this.api.UnitSystem.METRIC,
            origins: [`${origin}`],
            destinations: destinations,
        }

        return new Promise((resolve, reject) => {
            directionsService.getDistanceMatrix(
                params,
                (response, status) => {
                    if (status == this.api.DirectionsStatus.OK) {
                        resolve(response.rows[0].elements)
                    } else {
                        reject([status, response])
                    }
                },
            )
        });
    }

    /**
     * @param {string} destination - The address you want travel time to
     *
     * @returns {Promise<Object>} a Promise containing a description
     * of the travel time.
     // FIXME: Check walking and transit and return the better one
     */
    async travelTime(destination: string): Promise<Object> {
        return await this.batchDirectionsRequest(destination);
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
                google.maps;
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
