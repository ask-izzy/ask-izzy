/* eslint-disable @typescript-eslint/no-unused-vars */
type callback = (results: Record<string, unknown>, status: number) => void;

type LatLngLiteral = {
    lat: number,
    lng: number,
};

export type GeocoderRequest = {
    address?: string,
    location?: LatLng | LatLngLiteral,
};

type GeocoderAddressComponent = {
    long_name: string,
    short_name: string,
    types: Array<string>,
};

export type GeocoderResult = {
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

export type AutocompletionRequest = {
    input: string,
    location?: LatLng,
    radius?: number,
    componentRestrictions?: ComponentRestrictions,
    types?: Array<string>,
};

export type AutocompletePrediction = {
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
    PlacesServiceStatus: Record<string, unknown>;
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
    route(options: DirectionsRequest, callback: () => any): void;
}

type DistanceMatrixRequest = {
    travelMode: string,
    unitSystem: string,
    origins: Array<string>,
    destinations: Array<string>,
};

export type TravelMode = "DRIVING"|"WALKING"|"TRANSIT";

type TravelModes = {
    DRIVING: string,
    WALKING: string,
    TRANSIT: string,
};

declare class DistanceMatrixService {
    getDistanceMatrix(
        params: DistanceMatrixRequest,
        callback: () => any
    )
}

export declare class GoogleMaps {
    Geocoder(): Geocoder;
    InfoWindow(opts?: Record<string, unknown>): InfoWindow;
    LatLng(lat: number, lon: number, noWrap: boolean | null | undefined): LatLng;
    LatLngBounds(sw?: LatLng, ne?: LatLng): LatLngBounds;
    Map(node: Element, obj: Record<string, unknown>): GeoMap;
    places: Places;
    DirectionsTravelMode: TravelModes;
    TravelMode: TravelModes;
    DirectionsStatus: {OK: string};
    UnitSystem: {METRIC: string};
    DirectionsService(): DirectionsService;
    DistanceMatrixService(): DistanceMatrixService;
    Marker: Record<string, unknown>;
    markers: Array<Record<string, unknown>>;
    maps: Array<GeoMap>;
    event: {
        trigger: () => any,
    };
    GeocoderStatus: {OK: string};
}

declare class Google {
    maps: GoogleMaps;
}

