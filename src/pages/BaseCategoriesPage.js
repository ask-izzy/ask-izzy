/* @flow */

import React from "react";
import _ from "underscore";

import categories from "../constants/categories";

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

        var category = _.findWhere(categories, {
            key: this.props.params.page,
        });

        if (category === undefined) {
            throw new Error(`No such category as ${this.props.params.page}`);
        }

        this._category = category;
        return category;
    }

    /**
     * personalisationComponents:
     *
     * An array of components required to personalise this category.
     */
    /* flow:disable */
    get personalisationComponents(): Array<React.Component> {
        var components = [];

        if (this.props.params.page) {
            components = this.category.personalisation;
        } else if (this.props.params.search) {
            components = [
                require("./personalisation/Location"),
            ];
        } else {
            throw new Error("Unexpected");
        }
        return components.filter(component => component.showQuestion());
    }

}

export default BaseCategoriesPage;
