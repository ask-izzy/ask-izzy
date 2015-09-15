/* @flow */

"use strict";

import React from 'react';
import _ from 'underscore';

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
        if (this.props.params.page) {
            return this.category.personalisation;
        } else if (this.props.params.search) {
            return [
                require('./personalisation/Location'),
                require('./personalisation/Questions').Gender,
                require('./personalisation/Questions').Demographics,
            ];
        } else {
            throw new Error("Unexpected");
        }
    }

};

export default BaseCategoriesPage;
