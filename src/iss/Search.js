/* @flow */

import * as iss from "../iss";
import _ from "underscore";

export function append(search: string|iss.searchRequest): Search {
    return new AppendToSearch(search);
}

export function remove(search: string|iss.searchRequest): Search {
    return new RemoveSearch(search);
}

export function multiSearch(
    search: iss.searchRequest,
    merger: iss.searchResultMerger
): Search {
    return new MultiSearch(search, merger);
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

    multiSearch(
        search: iss.searchRequest,
        merger: iss.searchResultMerger
    ): Search {
        let next = multiSearch(search, merger);

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
            search.q = (search.q || "") + " " + this.search.q;
        }

        if (this.search.age_groups) {
            search.age_groups = (search.age_groups || [])
                .concat(this.search.age_groups);
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

        if (this.search.healthcare_card_holders) {
            search.healthcare_card_holders =
                this.search.healthcare_card_holders;
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
export class RemoveSearch extends Search {
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
 * Subclass for performing two searches and returning a unified resultset.
 * This is an awful hack.
 */
export class MultiSearch extends Search {
    merger: iss.searchResultMerger;

    constructor(
        search: string|iss.searchRequest,
        merger: iss.searchResultMerger
    ) {
        super(search)
        this.merger = merger;
    }


    compose(search: iss.searchRequest): iss.searchRequest {
        search = super.compose(search);
        if (search._multi) {
            throw new Error("Cannot nest multi searches");
        }

        search._multi = {
            alternate: (baseSearch) =>
                append(this.search).compose(baseSearch),
            merge: this.merger,
        }

        return search;
    }
}
