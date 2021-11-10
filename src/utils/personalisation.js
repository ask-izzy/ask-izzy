/* @flow */
import type {
    Node as ReactNode,
} from "react"

import {replaceUrlLocation} from "./url";
import {getCategory} from "../constants/categories";
import Category from "../constants/Category";
import personalisation from "../pages/personalisation";
import storage from "../storage";
import type { RouterContextObject } from "../contexts/router-context";
import { ServiceSearchRequest } from "../iss/ServiceSearchRequest";

export type PersonalisationPageRequiredProps = {
    onDoneTouchTap: () => void,
    goBack?: () => void,
    showBaseTextBox?: boolean,
    baseTextBoxComponent?: ReactNode,
    mobileView?: boolean,
    backToAnswers?: boolean,
    classNames?: string,
}

export type PersonalisationQuestionPageDefaultProps = {|
    name: string,
    question: string,
    byline?: string,
    info?: string,
    multipleChoice?: boolean,
    showSupportSearchBar?: Boolean,
    possibleAnswers: {[string]: ServiceSearchRequest},
    possibleAnswersDesc?: {[string]: string},
    icons?: Object,
    oldAnswers?: {[string]: string},
    showDVLinkBar?: boolean,
    textDVLinkBar?: ReactNode,
|}

export type PersonalisationNonQuestionPageDefaultProps = {|
    name: string,
    byline?: string,
    info?: string,
|}

export type PersonalisationPageDefaultProps =
    PersonalisationQuestionPageDefaultProps |
    PersonalisationNonQuestionPageDefaultProps

export type PersonalisationPageProps = {|
    ...PersonalisationPageDefaultProps,
    ...PersonalisationPageRequiredProps
|}

export type PersonalisationPageState = {
    showQuestionStepper: boolean,
    category: ?Category,
}

export type PersonalisationPage =
    typeof personalisation.BaseQuestion |
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

export function getCategoryFromRouter(
    router: $PropertyType<RouterContextObject, 'router'>
): ?Category {
    return getCategory(
        router.match.params.page
    )
}

export function getPageTitleFromRouter(
    router: $PropertyType<RouterContextObject, 'router'>
): string {
    const category = getCategoryFromRouter(router)
    if (category) {
        return category.name;
    } else if (router.match.params.search) {
        const search = decodeURIComponent(
            router.match.params.search
        );
        return `“${search.replace(/["']/g, "")}”`;
    } else {
        return "undefined-search";
    }
}

export function setLocationFromUrl(
    router: $PropertyType<RouterContextObject, 'router'>
): void {
    // Update the URL to include the location, so that links
    // are SEO-friendly. If we dont have a location but the
    // URL does, use the one from the url.
    const {suburb, state} = router.match.params;

    if (suburb && state) {
        if (storage.getSearchArea() != `${suburb}, ${state}`) {
            // Use the location from the URL.
            storage.setSearchArea(`${suburb}, ${state}`);
            storage.clearUserGeolocation()
        }
    }
}
