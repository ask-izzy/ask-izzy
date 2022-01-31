/* @flow */
import mc, {utils} from '@clevercanyon/js-object-mc';
import type { RouterContextObject } from "../contexts/router-context";
import {getPersonalisationPages, getCategoryFromRouter} from "../utils/personalisation"
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
    $removeElms?: SearchQueryArrayProps,
    $concat?: SearchQueryArrayProps,
    $applyIfShouldInjectAccessPoints?: SearchQueryChanges,
    ...SearchQueryOtherProps
|} | {| |}

export type SearchQueryModifier = {
    name: string,
    changes: SearchQueryChanges | Array<SearchQueryChanges>,
}

type SearchQueryArrayProps = {|
    term?: Array<string>,
    serviceTypes?: Array<string>,
    clientGenders?: Array<"Female" | "Male" | "Diverse">,
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
        | "Unspecified"
    >
|}
type SearchQueryOtherProps = {|
    catchment?: string,
    location?: Geolocation,

    // to figure out
    service_type_raw?: Array<string>,
    minimum_should_match?: string,
    show_in_askizzy_health?: boolean
|}

export function buildSearchQueryFromModifiers(modifier: Array<SearchQueryModifier>): SearchQuery {
    return modifier
        .map(queryModifier => queryModifier.changes)
        .flat()
        .reduce(modifySearchQuery, {})
}

mc.addOperation('$removeElms', function(source, params){
    const paths = Object.keys(params);
    for (const path of paths) {
        let valuesToRemove = params[path];
        if (!Array.isArray(valuesToRemove)) {
            throw new Error('Elements to remove must be supplied as an array');
        }
        let array = utils.get(source, path, []);
        // console.log({source, params, path, valuesToRemove, array})
        if (!Array.isArray(array)) {
            throw new Error('Cannot remove element from something which is not an array');
        }
        array = array.filter(elm => !valuesToRemove.includes(elm));
        utils.set(source, path, array);
    }
    return paths.length > 0;
});

mc.addOperation('$applyIfShouldInjectAccessPoints', function(source, params){
    const location = storage.getLocation()
    if (location && location.name.match(/, VIC$/)) {
        mc.patch(source, params)
    }
});

function modifySearchQuery(currentQuery: SearchQuery, queryChanges: SearchQuery): SearchQuery {
    const cake = mc.merge(currentQuery, queryChanges)
    console.log('YYYY', cake)
    return cake
}


export function getSearchQueryModifiers(
    router: $PropertyType<RouterContextObject, 'router'>
): Array<SearchQueryModifier> {
    const layers: Array<SearchQueryModifier | null> = []
    const category = getCategoryFromRouter(router)

    if (category) {
        console.log('cat', category)
        layers.push({
            name: `category: ${category.key}`,
            changes: {
                catchment: "prefer",
                ...category.searchQueryChanges
            }
        })
    } else if (router.match.params.search) {
        const searchTerm = decodeURIComponent(router.match.params.search)
        layers.push({
            name: `search: ${searchTerm}`,
            changes: {
                $push: {
                    term: searchTerm
                }
            }
        });

        // A special case for the "Find advocacy" button on the
        // DisabilityAdvocacyFinder page.
        if (searchTerm === "Disability Advocacy Providers") {
            layers.push({
                name: `DisabilityAdvocacyFinder override`,
                changes: {
                    service_type_raw: ["disability advocacy"],
                    $push: {
                        term: "disability"
                    }
                }
            })
        }
    }

    const personalisationPages = getPersonalisationPages(router)

    for (let item of personalisationPages) {
        if (!item.getSearchQueryChanges) {
            console.error('noooo', item.name)
        }
        const changes = item.getSearchQueryChanges()
        layers.push(changes
            ? {
                name: item.name,
                changes
            }
            : null
        );
    }

    return layers
}
