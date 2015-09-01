
type callback = (results: Object, status: number) => void;

type LatLngLiteral = {
    lat: number,
    lng: number,
};

type GeocoderRequest = {
    address?: string,
    location?: LatLng | LatLngLiteral,
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

declare class AutocompleteService {
    getPlacePredictions(obj: AutocompletionRequest, callback: callback): void;
}

declare class Places {
    AutocompleteService(): AutocompleteService;
    PlacesServiceStatus: Object;
}

declare class Map {
}

declare class GoogleMaps {
    Geocoder(): Geocoder;
    LatLng(lat: number, lon: number, noWrap: ?boolean): LatLng;
    LatLngBounds(sw?: LatLng, ne?: LatLng): LatLngBounds;
    Map(node: Element, obj: Object): Map;
    places: Places;
}

declare class Google {
    maps: GoogleMaps;
}
