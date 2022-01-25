import mc from '@clevercanyon/js-object-mc';
import type {
    serviceSearchRequest,
    SearchQueryModifier
} from "./serviceSearch";

export function buildSearchQuery(layers: Array<SearchQueryModifier>): serviceSearchRequest {
    return layers
        .map(queryModifier => queryModifier.changes)
        .reduce(modifySearchQuery)
}

function modifySearchQuery(currentQuery: serviceSearchRequest, queryChanges: serviceSearchRequest): serviceSearchRequest {
    return mc.merge(currentQuery, queryChanges)
}
