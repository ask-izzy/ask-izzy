/* @flow */
import type {
    PersonalisationPage,
} from "../../../flow/personalisation-page"
import type { SearchQueryChanges } from "../../iss/searchQueryBuilder";
import storage from
    "../../storage"

export default ({
    type: "location",
    name: "location",
    title: "Location",
    summaryLabel: "Where are you looking for help?",
    get summaryValue(): string {
        return storage.getSearchArea();
    },
    get searchQueryChanges(): SearchQueryChanges | null {
        const searchQuery = {}
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
}: PersonalisationPage)

