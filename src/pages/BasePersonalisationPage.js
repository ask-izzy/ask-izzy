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
        this.props.history.goBack();
    }

    nextStep(): void {
    }

    navigate(subpath: string): void {
        const parts = this.props.location.pathname.split("/");

        // Maintain (eg) '/category/foo' or '/search/badger'
        // prefix when navigating within personalisation
        this.props.history.pushState(
            null,
            `/${parts[1]}/${parts[2]}/${subpath}`,
            {}
        );
    }

    // flow:disable
    get currentComponent(): ?ReactComponent {
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
