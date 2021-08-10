/* $FlowIgnore */

import BaseCategoriesPage from "./BaseCategoriesPage";
import storage from "../storage";
import routerContext from "../contexts/router-context"
import {replaceUrlLocation} from "../utils/url.service";
import {setFeatureFlags} from "../utils/posthog";

const cachedRenderComponents = {}

class BasePersonalisationPage<ExtraState = {}> extends BaseCategoriesPage<
    ExtraState
> {
    static contextType = routerContext;

    previousStep(): void {
        // If our subpage has an onPreviousStep hook, call it, otherwise
        // just go back.
        this.context.router.navigate(-1);
    }

    nextStep(): void {
        // If our subpage has an onNextStep hook, call it.
        this.refs.subpage &&
        this.refs.subpage.onNextStep &&
        this.refs.subpage.onNextStep();
    }

    urlFor(subpath: string): string {
        // Rewrites the URL based on search location/personalisation
        const parts = decodeURIComponent(
            this.context.router.location.pathname
        ).split("/");
        const location = storage.getLocation();

        if (location) {
            replaceUrlLocation(location, parts)
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
        this.context.router.navigate(
            this.urlFor(subpath),
        );
    }

    get currentComponent(): ?React$ComponentType<*> {
        return this.personalisationComponents[this.currentComponentIdx];
    }

    get currentComponentForRender(): ?React$ComponentType<*> {
        if (!cachedRenderComponents[this.currentComponentIdx]) {
            cachedRenderComponents[this.currentComponentIdx] =
                setFeatureFlags(this.currentComponent);
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
