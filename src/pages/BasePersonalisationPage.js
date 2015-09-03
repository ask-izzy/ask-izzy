/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";
import _ from "underscore";

import categories from '../constants/categories';
import components from '../components';
import icons from '../icons';

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
class BasePersonalisationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            subpage: 0,
        };
    }

    // flow:disable
    static childContextTypes = {
        controller: React.PropTypes.instanceOf(BasePersonalisationPage),
    };

    getChildContext(): Object {
        return {
            controller: this,
        };
    }

    // flow:disable not supported yet
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

    previousStep(): void {
    }

    nextStep(): void {
    }
}

export default BasePersonalisationPage;
