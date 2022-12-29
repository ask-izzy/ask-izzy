import objectMerge, {utils} from "@clevercanyon/js-object-mc";
import type { NextRouter } from "next/router";

import {
    getSearchQueryChanges,
} from "@/src/utils/personalisation.js"
import {
    getCategoryFromRouter,
    getPersonalisationPages,
} from "@/src/utils/routing.js"
import storage, {Geolocation} from "@/src/storage.js";

export type SearchQuery = SearchQueryArrayProps & SearchQueryOtherProps;
export type SearchQueryChanges =
    (SearchQueryArrayProps &
        SearchQueryOtherProps & {
            $push?: {
                [Property in keyof SearchQueryArrayProps]:
                    NonNullable<SearchQueryArrayProps[Property]>[number]
            };
            $unset?: string[];
            $removeElms?: SearchQueryArrayProps;
            $concat?: SearchQueryArrayProps;
            $applyIfShouldInjectAccessPoints?: SearchQueryChanges;
        })
    | Record<string, never>
export type SearchQueryModifier = {
    name: string;
    changes: SearchQueryChanges | Array<SearchQueryChanges>;
};
type SearchQueryArrayProps = {
    term?: Array<string>;
    serviceTypes?: Array<string>;
    clientGenders?: Array<"Female" | "Male" | "Diverse" | "unspecified">;
    ageGroups?: Array<
        | "Prenatal"
        | "Baby"
        | "Toddler"
        | "Preschool"
        | "School Age"
        | "Early Adolescent"
        | "Mid Adolescent"
        | "Late Adolescent"
        | "Young Adult"
        | "Adult"
        | "Middle Aged Adult"
        | "Pre-retirement Age"
        | "Aged Persons"
        | "unspecified"
    >;
    serviceTypesRaw?: Array<string>; // This should be removed after ISS3 is no
    // longer supported
};
type SearchQueryOtherProps = {
    catchment?: "prefer" | "true" | "false";
    location?: {
        name: string;
        coordinates?: Geolocation;
    };
    siteId?: number;
    maxPageSize?: number;
    apiVersion?: "3" | "4";
    name?: string;
    // to figure out
    minimumShouldMatch?: string;
    showInAskIzzyHealth?: boolean;
};

export function buildSearchQueryFromModifiers(
    modifier: Array<SearchQueryModifier>,
): SearchQuery {
    return (
        modifier.map(queryModifier => queryModifier.changes)
            .flat()
            .reduce(modifySearchQuery, Object.freeze({}))
    )
}

objectMerge.addOperation("$removeElms", (source, params) => {
    const paths = Object.keys(params);
    for (const path of paths) {
        const valuesToRemove = params[path];
        if (!Array.isArray(valuesToRemove)) {
            throw new Error("Elements to remove must be supplied as an array");
        }
        let array = utils.get(source, path, []);
        if (!Array.isArray(array)) {
            throw new Error(
                "Cannot remove element from something which is not an array",
            );
        }
        array = array.filter(elm => !valuesToRemove.includes(elm));
        utils.set(source, path, array);
    }
    return paths.length > 0;
});

objectMerge.addOperation(
    "$applyIfShouldInjectAccessPoints",
    (source, params) => {
        const location = storage.getSearchArea()
        if (location?.match(/, VIC$/)) {
            objectMerge.patch(source, params)
        }
    },
);

export function modifySearchQuery(
    currentQuery: SearchQuery,
    queryChanges: SearchQueryChanges,
): SearchQuery {
    return (objectMerge.merge(currentQuery, queryChanges) as SearchQuery)
}

export function getSearchQueryModifiers(
    router: NextRouter,
): Array<SearchQueryModifier | null> {
    const layers: Array<SearchQueryModifier | null> = []
    const category = getCategoryFromRouter(router)

    if (!category) {
        throw Error("Tried to get search queries for a page without a category")
    }

    const categorySearchQueryChanges =
        typeof category.searchQueryChanges === "function" ?
            category.searchQueryChanges(router)
            : category.searchQueryChanges

    layers.push({
        name: `category - ${category.key}`,
        changes: {
            ...categorySearchQueryChanges,
        },
    })

    const personalisationPages = getPersonalisationPages(router)

    for (const page of personalisationPages) {
        const changes = getSearchQueryChanges(page)
        layers.push(changes ?
            {
                name: page.name,
                changes,
            }
            : null,
        );
    }

    return layers
}
