/* @flow */

import React from "react";
import { History } from "react-router";
import reactMixin from "react-mixin";

import BaseCategoriesPage from "./BaseCategoriesPage";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class BasePersonalisationPage extends BaseCategoriesPage {
    constructor(props: Object) {
        super(props);
    }

    static childContextTypes = {
        controller: React.PropTypes.instanceOf(BasePersonalisationPage),
    };

    getChildContext(): Object {
        return {
            controller: this,
        };
    }

    previousStep(): void {
        this.props.history.goBack();
    }

    nextStep(): void {
    }

    urlFor(subpath: string): string {
        // Maintain (eg) '/category/foo' or '/search/badger'
        // prefix when navigating within personalisation
        const parts = this.props.location.pathname.split("/personalise");

        return `${parts[0]}/${subpath}`
    }

    navigate(subpath: string): void {
        this.props.history.pushState(
            null,
            this.urlFor(subpath),
            {}
        );
    }

    // flow:disable
    get currentComponent(): ?ReactClass {
        return this.personalisationComponents[this.currentComponentIdx];
    }

    // flow:disable
    get currentComponentIdx(): number {
        return this.personalisationComponents.findIndex(component =>
            component.defaultProps.name == this.props.params.subpage
        );
    }

}

export default BasePersonalisationPage;
