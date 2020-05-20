/* @flow */

import * as React from "react";

import Category from "../constants/Category";
import {getCategory} from "../constants/categories";
import type {
    searchRequest,
    searchResultsMeta,
    Service,
} from "../iss";
import Location from "./personalisation/Location";
import storage from "../storage";
import personalisation from "./personalisation";
import routerContext from "../contexts/router-context";

type State = {
    meta?: ?searchResultsMeta,
    error?: any,
    statusCode?: number,
    objects?: Array<Service>,
    nextDisabled?: boolean,
    floatingContainerHeight?: number,
    isClient?: boolean,
    childServices?: Array<Service>,
    covidCategory: Object
}

class BaseCategoriesPage<ExtraState = {}> extends React.Component<
    Object, State & ExtraState> {
    static contextType = routerContext;

    /**
     * category:
     *
     * Return category information.
     */
    get category(): ?Category {
        return getCategory(
            this.context.router.match.params.page ||
            this.context.router.match.params.supportCategorySlug
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

    get search(): searchRequest {
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

    /**
     * personalisationComponents:
     *
     * An array of components required to personalise this category.
     */
    get personalisationComponents(): Array<React.ComponentType<any>> {
        let components = [];

        if (this.category) {
            components = this.category.personalisation;
        } else if (this.context.router.match.params.search) {
            components = [
                ...personalisation.OnlineSafetyScreenBundle(
                    personalisation.FreeTextAreYouSafe
                ),
                Location,
            ];
        }

        return components.filter(component => {
            if (typeof window === "undefined") {
                if (typeof component.staticShowPage === "function") {
                    // $FlowIgnore
                    return component.staticShowPage();
                }
            }

            return (typeof component.showPage === "function") &&
                // $FlowIgnore
                component.showPage()
        });
    }

    componentDidMount(): void {
        // Update the URL to include the location, so that links
        // are SEO-friendly. If we dont have a location but the
        // URL does, use the one from the url.
        const {suburb, state} = this.context.router.match.params;

        if (suburb && state) {
            if (storage.getLocation() != `${suburb}, ${state}`) {
                // Use the location from the URL.
                storage.setLocation(`${suburb}, ${state}`);
                storage.setCoordinates(null);
            }
        }

    }
}

export default BaseCategoriesPage;
