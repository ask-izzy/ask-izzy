/* @flow */

import React from "react";
import Router from "react-router";
import reactMixin from "react-mixin";
import _ from "underscore";

import BaseCategoriesPage from "./BaseCategoriesPage";

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

    componentDidMount(): void {
        /* Set the subpage if it was requested.
         * This is only used for testing. */
        if (_.has(this.props.query, "subpage")) {
            var subpage = this.props.query.subpage;
            var subpageIndex = this.personalisationComponents.findIndex(
                component => component.defaultProps.name == subpage
            );

            if (subpageIndex == -1) {
                throw new Error(`No such page: ${subpage}`);
            } else {
                this.setState({subpage: subpageIndex});
            }
        }
    }
}

export default BasePersonalisationPage;
