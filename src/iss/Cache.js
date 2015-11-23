import url from "url";
import _ from "underscore";

function keyPart(object: Object): string {
    // Can't just stringify directly because order matters.
    return JSON.stringify(
        Object.keys(object).sort().map((key) => [key, object[key]])
    );
}

function cacheKey(
    path: string, ignoreOffset: boolean
): string {
    let urlObj = url.parse(path, true);
    let query = urlObj.query;

    delete urlObj.query;
    delete urlObj.href;
    delete urlObj.path;
    delete urlObj.search;
    delete query.limit;

    if (ignoreOffset) {
        delete query.offset;
    }
    delete query.key;

    return keyPart(urlObj) + keyPart(query);
}

const fuzzyKey = _.memoize(_.partial(cacheKey, _, true));
const exactKey = _.memoize(_.partial(cacheKey, _, false));

export default class Cache {

    constructor() {
        this.exactMatches = {};
        this.fuzzyMatches = {};
    }

    exactHit(path: string): ?searchResults {
        return this.exactMatches[exactKey(path)];
    }

    revise(path: string, response: Object): void {
        let current = this.fuzzyMatches[fuzzyKey(path)];

        if (!current) {
            this.fuzzyMatches[fuzzyKey(path)] = response;
            this.exactMatches[exactKey(path)] = response;
        } else {
            // We only paginate forwards at the moment.
            // this will break if we paginating backwards.
            current.meta.next = response.meta.next;

            // Requests for this exact url should find these records
            this.exactMatches[exactKey(path)] = current;

            current.objects = current.objects.concat(response.objects);
            current.meta.available_count = current.objects.length;

            response.objects = current.objects;
            response.meta = current.meta;
        }
    }

}
