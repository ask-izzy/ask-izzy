/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";

import BaseCategoriesPage from './BaseCategoriesPage';
import components from '../components';
import icons from '../icons';

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
class BasePersonalisationPage extends BaseCategoriesPage {
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

    previousStep(): void {
    }

    nextStep(): void {
    }
}

export default BasePersonalisationPage;
