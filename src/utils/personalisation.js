/* @flow */
import {replaceUrlLocation} from "./url";
import {getCategory} from "../constants/categories";
import personalisation from "../pages/personalisation";
import BaseQuestion from "../pages/personalisation/BaseQuestion";
import storage from "../storage";
import type { RouterContextObject } from "../contexts/router-context";

export type PersonalisationPageType =
    typeof BaseQuestion & $ReadOnly<{
        title: string,
        staticShowPage?: () => boolean,
        showInSummary?: () => boolean,
    }> |
    typeof personalisation.Location |
    typeof personalisation.Intro

export function getFullPathForPersonalisationSubpath(
    router: $PropertyType<RouterContextObject, 'router'>,
    subpath: string
): string {
    // Rewrites the URL based on search location/personalisation
    const parts = decodeURIComponent(
        router.location.pathname
    ).split("/");
    const location = storage.getSearchArea();

    if (location) {
        replaceUrlLocation(location, parts)
    }

    // Replace everything after and including 'personalise'
    parts.splice(
        parts.indexOf("personalise"),
        parts.length,
        subpath
    )

    return parts.join("/");
}

export function navigateToPersonalisationSubpath(
    router: $PropertyType<RouterContextObject, 'router'>,
    subpath: string
): void {
    router.navigate(
        getFullPathForPersonalisationSubpath(router, subpath),
    );
}

export function getCurrentPersonalisationPage(
    router: $PropertyType<RouterContextObject, 'router'>,
): ?PersonalisationPageType {
    const personalisationPages = getPersonalisationPages(router)
    const index = getCurrentPersonalisationPageIndex(
        router,
        personalisationPages
    )
    return personalisationPages[index];
}

export function getCurrentPersonalisationPageIndex(
    router: $PropertyType<RouterContextObject, 'router'>,
    personalisationPages: Array<PersonalisationPageType>
): number {
    return personalisationPages.findIndex(component => {
        return component.defaultProps.name ===
            router.match.params.subpage
    });
}

/*
* personalisationComponents:
*
* An array of components required to personalise this category.
*/
export function getPersonalisationPages(
    router: $PropertyType<RouterContextObject, 'router'>,
): Array<PersonalisationPageType> {
    let components = [];

    const category = getCategory(
        router.match.params.page
    )

    if (category) {
        components = category.personalisation;
    } else if (router.match.params.search) {
        components = [
            personalisation.FreeTextAreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.Location,
        ];
    }

    return components.filter(component => {
        if (typeof window === "undefined") {
            if (typeof component.staticShowPage === "function") {
                // $FlowIgnore
                return component.staticShowPage();
            }
        }

        return (typeof component.showPage === "function") &&
            // $FlowIgnore
            component.showPage()
    });
}
