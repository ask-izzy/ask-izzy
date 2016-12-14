/* @flow */

import React from "react";
import { browserHistory } from "react-router";

import BaseCategoriesPage from "./BaseCategoriesPage";
import storage from "../storage";

class BasePersonalisationPage extends BaseCategoriesPage {
    constructor(props: Object) {
        super(props);
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    static childContextTypes = {
        controller: React.PropTypes.instanceOf(BasePersonalisationPage),
    };

    getChildContext(): Object {
        return {
            controller: this,
        };
    }

    previousStep(): void {
        browserHistory.goBack();
    }

    nextStep(): void {
        // If our subpage has an onNextStep hook, call it.
        this.refs.subpage &&
        this.refs.subpage.onNextStep &&
        this.refs.subpage.onNextStep();
    }

    urlHasSuburb(url: string): boolean {
        if (url.includes("-")) {
            return true;
        } else {
            return false;
        }
    }
    urlFor(subpath: string): string {
        // Maintain (eg) '/category/foo' or '/search/badger'
        // prefix when navigating within personalisation
        const parts = this.props.location.pathname.split("/");
        const location = storage.getLocation();
        let url = this.props.location.pathname;

        if (location) {
            const newUrlLocation = location
                .split(", ")
                .map(encodeURIComponent)
                .join("-");

            //if has suburb, remove the existing suburb
            if (this.urlHasSuburb(url)) {
                parts.splice(2, 1, newUrlLocation)
            } else {
                parts.splice(2, 0, newUrlLocation)
            }
        }

        // Replace everything after 'personalise'
        parts.splice(
            parts.indexOf("personalise"),
            parts.length,
            subpath
        )

        return parts.join('/');
    }

    navigate(subpath: string): void {
        this.context.router.push(
            this.urlFor(subpath),
        );
    }

    get currentComponent(): ?ReactClass<*> {
        return this.personalisationComponents[this.currentComponentIdx];
    }

    get currentComponentIdx(): number {
        return this.personalisationComponents.findIndex(component =>
            component.defaultProps.name == this.props.params.subpage
        );
    }

}

export default BasePersonalisationPage;
