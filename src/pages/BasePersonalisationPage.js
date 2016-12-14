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
        const parts = this.props.location.pathname.split("/");
        const location = storage.getLocation();
        console.log("urlFor");
        console.log(parts);

        if (location) {
            const newUrlLocation = location
                .split(", ")
                .map(encodeURIComponent)
                .join("-");

            //if url has suburb, remove the existing suburb
            if (parts.length > 3 && parts[3].includes("-")) {
                parts.splice(3, 1, newUrlLocation)
            } else if (parts.length > 2 && parts[2].includes("-")) {
                parts.splice(2, 1, newUrlLocation)
            } else {
                //we didn't find any suburb, don't delete any terms
                if (parts[1].includes("search")) {
                    parts.splice(3, 0, newUrlLocation)
                } else {
                    parts.splice(2, 0, newUrlLocation)
                }
            }
        }
        console.log(parts);

        // Replace everything after 'personalise'
        parts.splice(
            parts.indexOf("personalise"),
            parts.length,
            subpath
        )
        console.log(parts);

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
