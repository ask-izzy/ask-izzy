/* @flow */

import * as iss from "../iss";

export function append(search: string|iss.searchRequest): Search {
    return new AppendToSearch(search);
}

export function remove(search: string|iss.searchRequest): Search {
    return new RemoveSearch(search);
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
}


/**
 * Subclass for combining searches together.
 */
export class AppendToSearch extends Search {
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
            if (search[key] === this.search[key]) {
                delete search[key];
            }
        }

        return search;
    }
}
