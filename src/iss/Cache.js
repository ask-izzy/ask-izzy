/* @flow */

import url from "url";
import lru from "lru-cache";
import _ from "underscore";

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

export default class Cache {
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

    exactHit(path: string): ?Object {
        return this._cache.get(exactKey(path));
    }

    revise(path: string, response: Object): void {
        let current = this._cache.get(fuzzyKey(path));

        if (!current) {
            this._cache.set(fuzzyKey(path), response);
            this._cache.set(exactKey(path), response);
        } else {
            // We only paginate forwards at the moment.
            // this will break if we paginating backwards.
            current.meta.next = response.meta.next;

            // Requests for this exact url should find these records
            this._cache.set(exactKey(path), current);

            current.objects = current.objects.concat(response.objects);
            current.meta.available_count = current.objects.length;

            response.objects = current.objects;
            response.meta = current.meta;
        }
    }

}
