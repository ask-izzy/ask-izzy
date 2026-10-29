// Minimal types for the parts of the Google Maps API we use

type callback = (results: any, status: string) => void;

type LatLngLiteral = {
    lat: number,
    lng: number,
}

type GeocoderRequest = {
    address?: string,
    location?: LatLng | LatLngLiteral,
}

type GeocoderAddressComponent = {
    long_name: string,
    short_name: string,
    types: Array<string>,
}

type GeocoderResult = {
    address_components: Array<GeocoderAddressComponent>,
    types: Array<string>,
}

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
}

type AutocompletionRequest = {
    input: string,
    location?: LatLng,
    radius?: number,
    componentRestrictions?: ComponentRestrictions,
    types?: Array<string>,
}

type AutocompletePrediction = {
    description: string,
    place_id: string,
    types: Array<string>,
    terms: Array<{value: string}>,
}

declare class AutocompleteService {
    getPlacePredictions(obj: AutocompletionRequest, callback: callback): void;
}

declare class Places {
    AutocompleteService: new () => AutocompleteService;
    PlacesServiceStatus: any;
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
}

declare class DirectionsService {
    route(options: DirectionsRequest, callback: Function): void;
}

type DistanceMatrixRequest = {
    travelMode: string,
    unitSystem: string,
    origins: Array<string>,
    destinations: Array<string>,
}

type TravelMode = "DRIVING"|"WALKING"|"TRANSIT";

type TravelModes = {
    DRIVING: string,
    WALKING: string,
    TRANSIT: string,
}

declare class DistanceMatrixService {
    getDistanceMatrix(
        params: DistanceMatrixRequest,
        callback: Function
    ): void;
}

declare class GoogleMaps {
    Geocoder: new () => Geocoder;
    InfoWindow: new (opts?: any) => InfoWindow;
    LatLng: new (lat: number, lon: number, noWrap?: boolean | null) => LatLng;
    LatLngBounds: new (sw?: LatLng, ne?: LatLng) => LatLngBounds;
    Map: new (node: Element, obj: any) => GeoMap;
    places: Places;
    DirectionsTravelMode: TravelModes;
    TravelMode: TravelModes;
    DirectionsStatus: {OK: string};
    UnitSystem: {METRIC: string};
    DirectionsService: new () => DirectionsService;
    DistanceMatrixService: new () => DistanceMatrixService;
    Marker: any;
    markers: Array<any>;
    maps: Array<GeoMap>;
    event: {
        trigger: Function,
    };
    GeocoderStatus: {OK: string};
}

declare class Google {
    maps: GoogleMaps;
}
