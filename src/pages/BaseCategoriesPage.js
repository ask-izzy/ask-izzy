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
            throw "No such category " + this.props.params.page;
        }

        this._category = category;
        return category;
    }
};

export default BaseCategoriesPage;
