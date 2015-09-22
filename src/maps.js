/* @flow */

declare var google: Google;

class MapsApi {
    api: GoogleMaps;

    constructor(api: Object) {
        this.api = api;
    }

    /**
     * @param {GeocoderRequest} params - an object of params per the Google
     * Maps JS API.
     *
     * @returns {Promise<Array<GeocoderResult>>} a Promise containing the
     * geocode results.
     */
    geocode(params: GeocoderRequest): Promise<Array<GeocoderResult>> {
        var geocoder = new this.api.Geocoder();

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
        var autocompleter = new this.api.places.AutocompleteService();

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
