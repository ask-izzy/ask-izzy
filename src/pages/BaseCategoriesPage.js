/* @flow */

import React from "react";
import _ from "underscore";

import categories from "../constants/categories";
import badRouteParams from "../server/not_found";

class BaseCategoriesPage extends React.Component {
    /**
     * category:
     *
     * Return category information.
     */
    /* flow:disable not supported yet */
    get category(): categories.Category {
        if (this._category) {
            return this._category;
        }

        let category = _.findWhere(categories, {
            key: this.props.params.page,
        });

        this._category = category;
        return category;
    }

    // flow:disable not supported yet
    get title(): string {
        if (this.category) {
            return this.category.name;
        } else if (this.search) {
            const quote = new RegExp(`["']`, "g");
            const search = this.props.params.search;

            return `“${search.replace(quote, "")}”`;
        } else {
            throw badRouteParams;
        }
    }

    // flow:disable not supported yet
    get search(): iss.searchRequest {
        if (this.category) {
            return Object.assign({}, this.category.search);
        } else if (this.props.params.search) {
            return {
                q: this.props.params.search,
            };
        } else {
            throw badRouteParams;
        }
    }

    /**
     * personalisationComponents:
     *
     * An array of components required to personalise this category.
     */
    /* flow:disable */
    get personalisationComponents(): Array<ReactClass> {
        let components = [];

        if (this.category) {
            components = this.category.personalisation;
        } else if (this.props.params.search) {
            components = [
                require("./personalisation/Location"),
            ];
        } else {
            throw badRouteParams;
        }
        return components.filter(component => component.showQuestion());
    }

}

export default BaseCategoriesPage;
