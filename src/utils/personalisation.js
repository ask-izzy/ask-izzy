/* @flow */
import type {
    Node as ReactNode,
    ComponentType as ReactComponentType,
} from "react"

import {replaceUrlLocation} from "./url";
import {getCategory} from "../constants/categories";
import Category from "../constants/Category";
import personalisation from "../pages/personalisation";
import storage from "../storage";
import type { RouterContextObject } from "../contexts/router-context";
import type {serviceSearchRequest} from "../iss/serviceSearch";

export type PersonalisationPageRequiredProps = {
    onDoneTouchTap: () => void,
    goBack?: () => void,
    showBaseTextBox?: boolean,
    showDVLinkBar?: boolean,
    baseTextBoxComponent?: ReactNode,
    textDVLinkBar?: ReactNode,
    mobileView?: boolean,
    backToAnswers?: boolean,
    classNames?: string,
}
export type PersonalisationPageDefaultProps = {|
    name: string,
    byline?: string,
    info?: string,
|} | {|
    name: string,
    question: string,
    byline?: string,
    info?: string,
    possibleAnswers: {[string]: string},
    possibleAnswersDesc: {[string]: string},
    icons?: Object,
    oldAnswers?: {[string]: string},
|}
export type PersonalisationPageProps = {|
    ...PersonalisationPageDefaultProps,
    ...PersonalisationPageRequiredProps
|}

export type PersonalisationPageState = {
    showStepper: boolean,
    category: ?Category,
}

export type PersonalisationPage =
    ReactComponentType<PersonalisationPageRequiredProps> & $ReadOnly<{
        title: string,
        showPage?: () => boolean,
        staticShowPage?: ?() => boolean,
        showInSummary?: () => boolean,
        defaultProps: PersonalisationPageDefaultProps,
        getSearch?: serviceSearchRequest => ?serviceSearchRequest
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
): ?PersonalisationPage {
    const personalisationPages = getPersonalisationPages(router)
    const index = getCurrentPersonalisationPageIndex(
        router,
        personalisationPages
    )
    return personalisationPages[index];
}

export function getCurrentPersonalisationPageIndex(
    router: $PropertyType<RouterContextObject, 'router'>,
    personalisationPages: Array<PersonalisationPage>
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
): Array<PersonalisationPage> {
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

export function getBannerName(
    category: ?Category,
    questionPageName?: string
): string {
    return (questionPageName === "sub-indigenous" && "atsi") ||
        category?.key ||
        "homepage"
}
