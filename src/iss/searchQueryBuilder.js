/* @flow */
import objectMerge, {utils} from "@clevercanyon/js-object-mc";
import type { RouterContextObject } from "../contexts/router-context";
import {
    getPersonalisationPages,
    getCategoryFromRouter,
} from "../utils/personalisation"
import type {Geolocation} from "../storage";
import storage from "../storage";

export type SearchQuery = {|
    ...SearchQueryArrayProps,
    ...SearchQueryOtherProps
|}

export type SearchQueryChanges = {|
    $push?: $ObjMap<
        SearchQueryArrayProps,
        <T>(t: T) => $ElementType<T, number>
    >,
    $unset?: string[],
    $removeElms?: SearchQueryArrayProps,
    $concat?: SearchQueryArrayProps,
    $applyIfShouldInjectAccessPoints?: SearchQueryChanges,
    ...SearchQueryOtherProps
|} | {||}

export type SearchQueryModifier = {
    name: string,
    changes: SearchQueryChanges | Array<SearchQueryChanges>,
}

type SearchQueryArrayProps = {|
    term?: Array<string>,
    serviceTypes?: Array<string>,
    clientGenders?: Array<"Female" | "Male" | "Diverse" | "unspecified">,
    ageGroups?: Array<
        "Prenatal"
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
    >
|}
type SearchQueryOtherProps = {|
    catchment?: string,
    location?: {
        name: string,
        coordinates?: Geolocation,
    },
    siteId?: number,
    maxPageSize?: number,
    apiVersion?: "3" | "4",

    // to figure out
    service_type_raw?: Array<string>,
    minimum_should_match?: string,
    show_in_askizzy_health?: boolean
|}

export function buildSearchQueryFromModifiers(
    modifier: Array<SearchQueryModifier>
): SearchQuery {
    // Flow.js continues to be bad, in this case it doesn't handle .flat()
    // calls with different levels of array nesting
    // https://github.com/facebook/flow/issues/7397#issuecomment-1032207051
    return ((modifier
        .map(queryModifier => queryModifier.changes)
        .flat(): any): Array<SearchQueryChanges>)
        .reduce(modifySearchQuery, Object.freeze({}))
}

objectMerge.addOperation("$removeElms", (source, params) => {
    const paths = Object.keys(params);
    for (const path of paths) {
        let valuesToRemove = params[path];
        if (!Array.isArray(valuesToRemove)) {
            throw new Error("Elements to remove must be supplied as an array");
        }
        let array = utils.get(source, path, []);
        // console.log({source, params, path, valuesToRemove, array})
        if (!Array.isArray(array)) {
            throw new Error(
                "Cannot remove element from something which is not an array"
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
    }
);

function modifySearchQuery(
    currentQuery: SearchQuery,
    queryChanges: SearchQueryChanges
): SearchQuery {
    return (objectMerge.merge(currentQuery, queryChanges): SearchQuery)
}

export function getSearchQueryModifiers(
    router: $PropertyType<RouterContextObject, 'router'>
): Array<SearchQueryModifier | null> {
    const layers: Array<SearchQueryModifier | null> = []
    const category = getCategoryFromRouter(router)

    if (category) {
        layers.push({
            name: `category - ${category.key}`,
            changes: {
                catchment: "prefer",
                ...category.searchQueryChanges,
            },
        })
    } else if (router.match.params.search) {
        const searchTerm = decodeURIComponent(router.match.params.search)
        layers.push({
            name: `search - ${searchTerm}`,
            changes: {
                $push: {
                    term: searchTerm,
                },
            },
        });

        // A special case for the "Find advocacy" button on the
        // DisabilityAdvocacyFinder page.
        if (searchTerm === "Disability Advocacy Providers") {
            layers.push({
                name: `DisabilityAdvocacyFinder override`,
                changes: {
                    service_type_raw: ["disability advocacy"],
                    $push: {
                        term: "disability",
                    },
                },
            })
        }
    }

    const personalisationPages = getPersonalisationPages(router)

    for (let item of personalisationPages) {
        // Ideally every personalisation page object should
        // have the getSearchQueryChanges property but some
        // pages like src/pages/personalisation/OnlineSafetyScreen.js
        // have a wrapper component around them.
        if (item.getSearchQueryChanges) {
            const changes = item.getSearchQueryChanges()
            layers.push(changes ?
                {
                    name: item.name,
                    changes,
                }
                : null
            );
        }
    }

    return layers
}
