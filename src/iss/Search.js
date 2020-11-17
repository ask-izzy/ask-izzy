/* @flow */

import * as iss from "../iss";
import _ from "underscore";

export function housingCrisis(
    filter: (search: iss.searchRequest) => boolean
): Search {
    return remove("housing")
        .remove("-(respite care)")
        .remove("-(housing information)")
        .remove("-hef")
        .append("(crisis accommodation)")
        .conditionally(
            remove("(crisis accommodation)")
                .remove({service_type: ["housing"]})
                .append({
                    service_type: ["Homelessness Access Point"],
                    catchment: "true",
                    q: "(Homelessness Access Point)",
                }),
            filter
        );
}

export function append(search: string|iss.searchRequest): Search {
    return new AppendToSearch(search);
}

export function remove(search: string|iss.searchRequest): Search {
    return new RemoveFromSearch(search);
}

export function conditionally(
    other: Search,
    filter: (search: iss.searchRequest) => boolean
): Search {
    return new ConditionalSearch(other, filter);
}

/**
 * Base class for composing search terms.
 */
export class Search {
    search: iss.searchRequest;
    chain: Search;

    constructor(search: string|iss.searchRequest) {
        if (typeof search === "string") {
            this.search = { q: search };
        } else {
            this.search = search;
        }
    }

    compose(search: iss.searchRequest): iss.searchRequest {
        // Default behaviour is to do nothing but chain up
        search = Object.assign({}, search);

        if (this.chain) {
            search = this.chain.compose(search);
        }

        return search;
    }

    append(search: string|iss.searchRequest): Search {
        let next = append(search);

        next.chain = this;
        return next;
    }

    remove(search: string|iss.searchRequest): Search {
        let next = remove(search);

        next.chain = this;
        return next;
    }

    conditionally(
        other: Search,
        filter: (search: iss.searchRequest) => boolean
    ): Search {
        let next = conditionally(other, filter);

        next.chain = this;
        return next;
    }

}

/**
 * Subclass for combining searches together.
 */
export class AppendToSearch extends Search {

    /* eslint-disable complexity*/
    compose(search: iss.searchRequest): iss.searchRequest {
        search = super.compose(search);
        if (this.search.q) {
            search.q = (search.q ? `${search.q} ` : '') + this.search.q;
        }

        if (this.search.age_group) {
            search.age_group = (search.age_group || [])
                .concat(this.search.age_group);
        }

        if (this.search.client_gender) {
            search.client_gender = (search.client_gender || [])
                .concat(this.search.client_gender);
        }

        if (this.search.service_type) {
            search.service_type = (search.service_type || [])
                .concat(this.search.service_type);
        }

        if (this.search.is_bulk_billing) {
            search.is_bulk_billing = this.search.is_bulk_billing;
        }

        if (this.search.show_in_askizzy_health) {
            search.show_in_askizzy_health =
                this.search.show_in_askizzy_health;
        }

        if (this.search.minimum_should_match) {
            search.minimum_should_match =
                this.search.minimum_should_match;
        }

        if (this.search.catchment) {
            search.catchment =
                this.search.catchment;
        }

        return search;
    }
}

/**
 * Subclass for removing a search term.
 */
export class RemoveFromSearch extends Search {

    compose(search: iss.searchRequest): iss.searchRequest {
        search = super.compose(search);

        if (search.q && this.search.q) {
            search.q = search.q.replace(this.search.q, "");
        }

        for (const key of Object.keys(this.search)) {
            // Allow removing array items
            if (_.isArray(search[key])) {
                if (_.isArray(this.search[key])) {
                    search[key] = _(search[key]).difference(this.search[key])
                } else {
                    search[key] = _(search[key]).without(this.search[key])
                }
            } else if (search[key] === this.search[key]) {
                delete search[key];
            }
        }

        return search;
    }
}


/**
 * Subclass for conditionally modifying a search
 */
export class ConditionalSearch extends Search {

    other: Search;
    filter: (search: iss.searchRequest) => boolean;

    constructor(
        other: Search,
        filter: (search: iss.searchRequest) => boolean
    ) {
        super("");
        this.other = other;
        this.filter = filter;
    }

    compose(search: iss.searchRequest): iss.searchRequest {
        search = super.compose(search);

        if (this.filter(search)) {
            return this.other.compose(search);
        }

        return search;
    }
}
