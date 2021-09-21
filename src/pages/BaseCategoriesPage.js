/* @flow */

import * as React from "react";

import Category from "../constants/Category";
import {getCategory} from "../constants/categories";
import Service from "../iss/Service";
import type {
    // searchResultsMeta,
} from "../iss/search"

import type {serviceSearchRequest} from "../iss/serviceSearch";
import storage from "../storage";
import routerContext from "../contexts/router-context";

type State = {
    // meta?: ?searchResultsMeta,
    // error?: any,
    // statusCode?: number,
    // objects?: Array<Service>,
    nextDisabled?: boolean,
    // floatingContainerHeight?: number,
    // isClient?: boolean,
    // childServices?: Array<Service>
}

class BaseCategoriesPage<ChildProps = {...}, ChildState = {...}>
    extends React.Component<ChildProps, ChildState & State> {
    static contextType: any = routerContext;

    constructor(props: Object, context: Object) {
        super(props, context);
        this.context = context
    }

    /**
     * category:
     *
     * Return category information.
     */
    get category(): ?Category {
        return getCategory(
            this.context.router.match.params.page
        )
    }

    get title(): string {
        if (this.category) {
            return this.category.name;
        } else if (this.search.q !== "undefined-search") {
            const quote = new RegExp(`["']`, "g");
            const search = decodeURIComponent(
                this.context.router.match.params.search
            );

            return `“${search.replace(quote, "")}”`;
        } else {
            return "undefined-category";
        }
    }

    get search(): serviceSearchRequest {
        if (this.category) {
            return Object.assign({}, this.category.search);
        } else if (this.context.router.match.params.search) {
            return {
                q: decodeURIComponent(this.context.router.match.params.search),
            };
        } else {
            return {
                q: "undefined-search",
            };
        }
    }

    componentDidMount(): void {
        // Update the URL to include the location, so that links
        // are SEO-friendly. If we dont have a location but the
        // URL does, use the one from the url.
        const {suburb, state} = this.context.router.match.params;

        if (suburb && state) {
            if (storage.getSearchArea() != `${suburb}, ${state}`) {
                // Use the location from the URL.
                storage.setSearchArea(`${suburb}, ${state}`);
                storage.clearUserGeolocation()
            }
        }

    }
}

export default BaseCategoriesPage;
