/* @flow */

import React from "react";
import _ from "underscore";

import categories, { Category } from "../constants/categories";
import badRouteParams from "../server/not_found";
import { searchRequest } from "../iss";
import Location from "./personalisation/Location";

class BaseCategoriesPage extends React.Component {
    /**
     * category:
     *
     * Return category information.
     */
    get category(): Category {
        if (this._category) {
            return this._category;
        }

        let category = _.findWhere(categories, {
            key: this.props.params.page,
        });

        this._category = category;
        return category;
    }

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

    get search(): searchRequest {
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
    get personalisationComponents(): Array<ReactClass> {
        let components = [];

        if (this.category) {
            components = this.category.personalisation;
        } else if (this.props.params.search) {
            components = [
                Location,
            ];
        } else {
            throw badRouteParams;
        }
        return components.filter(component =>
            (typeof component.showQuestion == "function") &&
            component.showQuestion()
        );
    }

}

export default BaseCategoriesPage;
