/* flow:disable */

import BaseCategoriesPage from "./BaseCategoriesPage";
import storage from "../storage";
import routerContext from "../contexts/router-context";
import posthog from "../utils/posthog";

const cachedRenderComponents = {}

class BasePersonalisationPage<ExtraState = {}> extends BaseCategoriesPage<
    ExtraState
> {
    static contextType = routerContext;

    previousStep(): void {
        // If our subpage has an onPreviousStep hook, call it, otherwise
        // just go back.
        this.context.router.history.goBack();
    }

    nextStep(): void {
        // If our subpage has an onNextStep hook, call it.
        this.refs.subpage &&
        this.refs.subpage.onNextStep &&
        this.refs.subpage.onNextStep();
    }

    replaceUrlLocation(location: string, parts: Array): void {
        // Rewrites a URL consisting of parts based on provided location.
        const newUrlLocation = location
            .split(", ")
            .map(encodeURIComponent)
            .join("-");

        // If URL has suburb, replace the existing suburb.
        // Do not replace if the url looks to include a '-' as
        // part of the ISS search query.
        if (parts.length > 3 &&
            parts[3].includes("-") &&
            !parts[3].includes(" -") &&
            !parts[3].includes("%20-")
        ) {
            parts.splice(3, 1, newUrlLocation)
        } else if (parts.length > 2 &&
            parts[2].includes("-") &&
            !parts[2].includes(" -") &&
            !parts[2].includes("%20-")
        ) {
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

    urlFor(subpath: string): string {
        // Rewrites the URL based on search location/personalisation
        const parts = decodeURIComponent(
            this.props.location.pathname
        ).split("/");
        const location = storage.getLocation();

        if (location) {
            this.replaceUrlLocation(location, parts)
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
        this.context.router.history.push(
            this.urlFor(subpath),
        );
    }

    get currentComponent(): ?React$ComponentType<*> {
        return this.personalisationComponents[this.currentComponentIdx];
    }

    get currentComponentForRender(): ?React$ComponentType<*> {
        if (!cachedRenderComponents[this.currentComponentIdx]) {
            cachedRenderComponents[this.currentComponentIdx] = posthog
                .setFeatureFlags(this.currentComponent);
        }
        return cachedRenderComponents[this.currentComponentIdx];
    }

    get currentComponentIdx(): number {
        return this.personalisationComponents.findIndex(component => {
            return component.defaultProps.name ===
                this.context.router.match.params.subpage
        });
    }
}

export default BasePersonalisationPage;
