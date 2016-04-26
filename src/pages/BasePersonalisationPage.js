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

    urlFor(subpath: string): string {
        // Maintain (eg) '/category/foo' or '/search/badger'
        // prefix when navigating within personalisation
        // Also, maintain '/in/Abbotsford-Vic' SEO stuff
        const parts = this.props.location.pathname.split("/");
        const location = storage.getLocation();

        if (location) {
            const newUrlLocation = location
                .split(", ")
                .map(encodeURIComponent)
                .join("-");
            const separatorIdx = parts.indexOf("in");

            if (separatorIdx > -1) {
                // The url already includes '/in'
                parts.splice(3, 2, "in", newUrlLocation)
            } else {
                parts.splice(3, 0, "in", newUrlLocation);
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

    get currentComponent(): ?ReactClass {
        return this.personalisationComponents[this.currentComponentIdx];
    }

    get currentComponentIdx(): number {
        return this.personalisationComponents.findIndex(component =>
            component.defaultProps.name == this.props.params.subpage
        );
    }

}

export default BasePersonalisationPage;
