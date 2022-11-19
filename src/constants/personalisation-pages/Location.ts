import type {
    PersonalisationLocationPage,
} from "@/types/personalisation-page"
import type { SearchQueryChanges } from "@/src/iss/searchQueryBuilder"
import storage from "@/src/storage"

export default {
    type: "location",
    name: "location",
    title: "Location",
    summaryLabel: "Where are you looking for help?",
    get summaryValue(): string {
        return storage.getSearchArea();
    },
    get searchQueryChanges(): SearchQueryChanges | null {
        const searchQuery: any = {}
        /* Location/Area is required */
        const searchArea = storage.getSearchArea();
        if (!searchArea) {
            return null;
        }

        searchQuery.location = {}
        searchQuery.location.name = searchArea

        /* Coordinates are optional */
        const userLocation = storage.getUserGeolocation();
        if (userLocation && userLocation.name === searchArea) {
            searchQuery.location.coordinates = userLocation;
        }

        return searchQuery;
    },
} as PersonalisationLocationPage

