/* @flow */

import _ from "underscore";
import type {serviceSearchRequest} from "./serviceSearch"

export function append(
    search: string | serviceSearchRequest
): ServiceSearchRequest {
    return new AppendToServiceSearchRequest(search);
}

export function remove(
    search: string | serviceSearchRequest
): ServiceSearchRequest {
    return new RemoveFromServiceSearchRequest(search);
}

export function conditionally(
    other: ServiceSearchRequest,
    filter: (search: serviceSearchRequest) => boolean
): ServiceSearchRequest {
    return new ConditionallyModifyServiceSearchRequest(other, filter);
}

export function housingCrisis(
    filter: (search: serviceSearchRequest) => boolean
): ServiceSearchRequest {
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

/**
 * Base class for composing search terms.
 */
export class ServiceSearchRequest {
    search: serviceSearchRequest;
    chain: ServiceSearchRequest;

    constructor(search: string|serviceSearchRequest) {
        if (typeof search === "string") {
            this.search = { q: search };
        } else {
            this.search = search;
        }
    }

    compose(search: serviceSearchRequest): serviceSearchRequest {
        // Default behaviour is to do nothing but chain up
        search = Object.assign({}, search);

        if (this.chain) {
            search = this.chain.compose(search);
        }

        return search;
    }

    append(search: string|serviceSearchRequest): ServiceSearchRequest {
        let next = append(search);

        next.chain = this;
        return next;
    }

    remove(search: string|serviceSearchRequest): ServiceSearchRequest {
        let next = remove(search);

        next.chain = this;
        return next;
    }

    conditionally(
        other: ServiceSearchRequest,
        filter: (search: serviceSearchRequest) => boolean
    ): ServiceSearchRequest {
        let next = conditionally(other, filter);

        next.chain = this;
        return next;
    }

}

/**
 * Subclass for combining searches together.
 */
class AppendToServiceSearchRequest extends ServiceSearchRequest {

    /* eslint-disable complexity*/
    compose(search: serviceSearchRequest): serviceSearchRequest {
        search = super.compose(search);
        if (this.search.q) {
            search.q = (search.q ? `${search.q} ` : "") + this.search.q;
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
class RemoveFromServiceSearchRequest extends ServiceSearchRequest {

    compose(search: serviceSearchRequest): serviceSearchRequest {
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
class ConditionallyModifyServiceSearchRequest extends ServiceSearchRequest {

    other: ServiceSearchRequest;
    filter: (search: serviceSearchRequest) => boolean;

    constructor(
        other: ServiceSearchRequest,
        filter: (search: serviceSearchRequest) => boolean
    ) {
        super("");
        this.other = other;
        this.filter = filter;
    }

    compose(search: serviceSearchRequest): serviceSearchRequest {
        search = super.compose(search);

        if (this.filter(search)) {
            return this.other.compose(search);
        }

        return search;
    }
}
