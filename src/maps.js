/* @flow */

"use strict";

type callback = (results: Object, status: number) => void;

declare class GoogleMapsGeocoder {
    geocode(obj: Object, callback: callback): void;
}

declare class GoogleMapsLatLng {
}

declare class GoogleAutocompleteService {
    getPlacePredictions(obj: Object, callback: callback): void;
}

declare class GooglePlaces {
    AutocompleteService(): GoogleAutocompleteService;
    PlacesServiceStatus: Object;
}

declare class GoogleMaps {
    Geocoder(): GoogleMapsGeocoder;
    LatLng(lat: number, lon: number, noWrap: ?boolean): GoogleMapsLatLng;
    places: GooglePlaces;
}

declare class Google {
    maps: GoogleMaps;
}

declare var google: Google;

class MapsApi {
    api: GoogleMaps;

    constructor(api: Object) {
        this.api = api;
    }

    /**
     * geocode:
     * params: an object of params per the Google Maps JS API
     *
     * Returns: a Promise containing the geocode
     */
    geocode(params: Object): Promise<Array<Object>> {
        var geocoder = new this.api.Geocoder;

        return new Promise((resolve, reject) =>
            geocoder.geocode(params, (results, status) => {
                if (status === this.api.GeocoderStatus.OK) {
                    resolve(results);
                } else {
                    reject(status, results);
                }
            }));
    }

    autocompletePlaces(params: Object): Promise<Array<Object>> {
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
 * Maps:
 * Returns a promise that will resolve to the Google Maps API
 */
function maps(): Promise<MapsApi> {
    return new Promise((resolve, reject) => {
        function checkLoaded() {
            try {
                google.maps;
                resolve(new MapsApi(google.maps));
            } catch (e) {
                /* try again in 500ms */
                setTimeout(checkLoaded, 500);
            }
        }

        checkLoaded();
    });
}

export default maps;
