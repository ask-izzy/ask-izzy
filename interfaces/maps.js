/* @flow */

type callback = (results: Object, status: number) => void;

type LatLngLiteral = {
    lat: number,
    lng: number,
};

type GeocoderRequest = {
    address?: string,
    location?: LatLng | LatLngLiteral,
};

type GeocoderAddressComponent = {
    long_name: string,
    short_name: string,
    types: Array<string>,
};

type GeocoderResult = {
    address_components: Array<GeocoderAddressComponent>,
    types: Array<string>,
};

declare class Geocoder {
    geocode(obj: GeocoderRequest, callback: callback): void;
}

declare class LatLng {
}

declare class LatLngBounds {
    extend(point: LatLng): LatLngBounds;
}

type ComponentRestrictions = {
    country?: string,
};

type AutocompletionRequest = {
    input: string,
    location?: LatLng,
    radius?: number,
    componentRestrictions?: ComponentRestrictions,
    types?: Array<string>,
};

type AutocompletePrediction = {
    description: string,
    place_id: string,
    types: Array<string>,
    terms: Array<{value: string}>,
};

declare class AutocompleteService {
    getPlacePredictions(obj: AutocompletionRequest, callback: callback): void;
}

declare class Places {
    AutocompleteService(): AutocompleteService;
    PlacesServiceStatus: Object;
}

declare class InfoWindow {
    set(key: string, value: any): void;
}

declare class GeoMap {
}

type DirectionsRequest = {
    origin: string,
    destination: string,
    travelMode?: string,
    unitSystem?: string,
    language?: string,
};

declare class DirectionsService {
    route(options: DirectionsRequest, callback: Function): void;
};

type DistanceMatrixRequest = {
    travelMode: string,
    unitSystem: string,
    origins: Array<string>,
    destinations: Array<string>,
};

type TravelMode = "DRIVING"|"WALKING"|"TRANSIT";

type TravelModes = {
    DRIVING: string,
    WALKING: string,
    TRANSIT: string,
};

declare class DistanceMatrixService {
    getDistanceMatrix(
        params: DistanceMatrixRequest,
        callback: Function
    ): void,
};

declare class GoogleMaps {
    Geocoder(): Geocoder;
    InfoWindow(opts?: Object): InfoWindow;
    LatLng(lat: number, lon: number, noWrap: ?boolean): LatLng;
    LatLngBounds(sw?: LatLng, ne?: LatLng): LatLngBounds;
    Map(node: Element, obj: Object): GeoMap;
    places: Places;
    DirectionsTravelMode: TravelModes;
    TravelMode: TravelModes;
    DirectionsStatus: {OK: string};
    UnitSystem: {METRIC: string};
    DirectionsService(): DirectionsService;
    DistanceMatrixService(): DistanceMatrixService;
    Marker: Object;
    markers: Array<Object>;
    maps: Array<GeoMap>;
    event: {
        trigger: function,
    };
    GeocoderStatus: {OK: string};
};

declare class Google {
    maps: GoogleMaps;
};
