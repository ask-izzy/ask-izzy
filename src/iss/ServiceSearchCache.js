/* @flow */

import url from "url";
import lru from "lru-cache";
import _ from "underscore";

import type {serviceSearchResults} from "./serviceSearch"

function keyPart(object: Object): string {
    // Can't just stringify directly because order matters.
    return JSON.stringify(
        Object.keys(object).sort().map((key) => [key, object[key]])
    );
}

function cacheKey(
    urlPath: string, ignoreOffset: boolean
): string {
    let urlObj, query;
    // create a new object from URL object, extracting a few properties and
    // throwing them away.
    {
        let href, path, search; // eslint-disable-line no-unused-vars
        ({query, href, path, search, ...urlObj} = url.parse(urlPath, true))
    }
    if (query) {
        delete query.limit;

        if (ignoreOffset) {
            delete query.offset;
        }
        delete query.key;
        return keyPart(urlObj) + keyPart(query);
    }

    return keyPart(urlObj);
}

const fuzzyKey = _.memoize(_.partial(cacheKey, _, true));
const exactKey = _.memoize(_.partial(cacheKey, _, false));

export default class ServiceSearchCache {
    _cache: Object;
    _disposing: boolean;

    constructor() {
        this._cache = lru({
            max: 150, // Only track 150 keys in the cache
            maxAge: 1000 * 60 * 60, // Discard anything over 1 hour
            dispose: this.onDispose.bind(this),
        });
    }

    onDispose(disposedKey: string, disposedValue: any): void {
        if (this._disposing) {
            return
        }

        try {
            this._disposing = true
            // We're storing the same thing under several keys.
            // Remove all of them.
            this._cache.forEach((value: string, key: any) =>
                (key != disposedKey) &&
                (value === disposedValue) &&
                this._cache.del(key)
            )
        } finally {
            this._disposing = false
        }
    }

    getPageForQuery(path: string): ?serviceSearchResults {
        return this._cache.get(exactKey(path));
    }

    getAllPagesForQuery(path: string): ?serviceSearchResults {
        return this._cache.get(fuzzyKey(path));
    }

    revise(path: string, response: serviceSearchResults): void {
        let responseWithAllPages: serviceSearchResults = this._cache
            .get(fuzzyKey(path));
        const responseForCurrentPage: serviceSearchResults = {
            meta: response.meta,
            services: [...response.services],
        }

        if (!responseWithAllPages) {
            responseWithAllPages = responseForCurrentPage
        } else {
            responseWithAllPages = {
                meta: {
                    ...responseWithAllPages.meta,
                    next: responseForCurrentPage.meta.next, // We only paginate
                    // forwards at the moment. This will break if we
                    // paginating backwards.
                    available_count: responseForCurrentPage
                        .meta.available_count,
                },
                services: [
                    ...responseWithAllPages.services,
                    ...responseForCurrentPage.services,
                ],
            }
        }

        // Requests for this fuzzy url should find all records
        this._cache.set(fuzzyKey(path), responseWithAllPages);
        // Requests for this exact url should find these records
        this._cache.set(exactKey(path), responseForCurrentPage);
    }

}
