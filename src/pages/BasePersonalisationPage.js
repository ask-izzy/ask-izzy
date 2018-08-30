/* flow:disable */

import PropTypes from "proptypes";
import { browserHistory } from "react-router";

import BaseCategoriesPage from "./BaseCategoriesPage";
import storage from "../storage";

class BasePersonalisationPage extends BaseCategoriesPage {
    constructor(props: Object) {
        super(props);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    getChildContext(): Object {
        return {
            controller: this,
        };
    }

    previousStep(): void {
        // If our subpage has an onPreviousStep hook, call it, otherwise
        // just go back.
        this.refs.subpage &&
        this.refs.subpage.onPreviousStep &&
        this.refs.subpage.onPreviousStep() ||
        browserHistory.goBack();
    }

    nextStep(): void {
        // If our subpage has an onNextStep hook, call it.
        this.refs.subpage &&
        this.refs.subpage.onNextStep &&
        this.refs.subpage.onNextStep();
    }

    urlFor(subpath: string): string {
        // Rewrites the URL based on search location/personalisation
        const parts = this.props.location.pathname.split("/");
        const location = storage.getLocation();

        if (location) {
            const newUrlLocation = location
                .split(", ")
                .map(encodeURIComponent)
                .join("-");

            // If URL has suburb, replace the existing suburb
            if (parts.length > 3 && parts[3].includes("-")) {
                parts.splice(3, 1, newUrlLocation)
            } else if (parts.length > 2 && parts[2].includes("-")) {
                parts.splice(2, 1, newUrlLocation)
            } else {
                // We didn't find any suburb
                // just add the new location to the url
                if (parts[1].includes("search")) {
                    parts.splice(3, 0, newUrlLocation)
                } else {
                    parts.splice(2, 0, newUrlLocation)
                }
            }
        }

        // Replace everything after 'personalise'
        parts.splice(
            parts.indexOf("personalise"),
            parts.length,
            subpath
        )

        return parts.join("/");
    }

    navigate(subpath: string): void {
        this.context.router.push(
            this.urlFor(subpath),
        );
    }

    get currentComponent(): ?React$ComponentType<*> {
        return this.personalisationComponents[this.currentComponentIdx];
    }

    get currentComponentIdx(): number {
        return this.personalisationComponents.findIndex(component =>
            component.defaultProps.name == this.props.params.subpage
        );
    }
}

BasePersonalisationPage.childContextTypes = {
    controller: PropTypes.instanceOf(BasePersonalisationPage),
};

export default BasePersonalisationPage;
