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
import type { SearchQueryChanges } from "../iss/searchQueryBuilder";

export type PersonalisationQuestionPageDefaultProps = {|
    name: string,
    question: string,
    byline?: string,
    info?: string,
    multipleChoice?: boolean,
    showSupportSearchBar?: boolean,
    possibleAnswers: {[string]: SearchQueryChanges},
    descriptionsForAnswers?: {[string]: string},
    icons?: Object,
    oldAnswers?: {[string]: string},
    showDVLinkBar?: boolean,
    textDVLinkBar?: ReactNode,
    noQuestionStepperBreadcrumb?: boolean,
    noQuestionStepperStep?: boolean,
|}

export type PersonalisationNonQuestionPageDefaultProps = {|
    name: string,
    byline?: string,
    info?: string,
    noQuestionStepperBreadcrumb?: boolean,
    noQuestionStepperStep?: boolean,
    baseTextBoxComponent?: ReactNode,
    heading: string,
    showDoneButton?: boolean
|}

export type PersonalisationQuestionPageOtherProps = {
    onDoneTouchTap: () => void,
    goBack?: () => void,
    mobileView?: boolean,
    backToAnswers?: boolean,
    classNames?: string,
}
export type PersonalisationNonQuestionPageOtherProps = {
    ...PersonalisationQuestionPageOtherProps,
}

export type PersonalisationQuestionPageProps = {|
    ...PersonalisationQuestionPageDefaultProps,
    ...PersonalisationQuestionPageOtherProps
|}
export type PersonalisationNonQuestionPageProps = {|
    ...PersonalisationNonQuestionPageDefaultProps,
    ...PersonalisationNonQuestionPageOtherProps
|}
export type PersonalisationPageProps =
    PersonalisationQuestionPageProps |
    PersonalisationNonQuestionPageProps;

export type PersonalisationPageState = {
    category: ?Category,
}

export type PersonalisationPage =
    typeof personalisation.BaseQuestion |
    typeof personalisation.Location |
    typeof personalisation.WhoIsLookingForHelp

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
    subpath: string,
    navigateOptions?: {}
): void {
    router.navigate(
        getFullPathForPersonalisationSubpath(router, subpath),
        navigateOptions
    );
}

export function getCurrentPersonalisationPage(
    router: $PropertyType<RouterContextObject, 'router'>,
): ?PersonalisationPage {
    const pages = getPersonalisationPages(router)
    const index = getCurrentPersonalisationPageIndex(
        router,
        pages
    )
    return typeof index === "number" ? pages[index] : null;
}

export function getCurrentPersonalisationPageIndex(
    router: $PropertyType<RouterContextObject, 'router'>,
    personalisationPages: Array<PersonalisationPage>
): ?number {
    const currentPageName = router.match.params.subpage
    const index = personalisationPages.findIndex(page => {
        return page.defaultProps.name === currentPageName
    });

    return index >= 0 ? index : null
}

/*
* An array of pages used in the process of personalising the current
* category/search.
*/
export function getPersonalisationPages(
    router: $PropertyType<RouterContextObject, 'router'>,
): Array<PersonalisationPage> {
    let pages = [];

    const category = getCategory(
        router.match.params.page
    )

    if (category) {
        pages = category.personalisation;
    } else if (router.match.params.search) {
        pages = [
            personalisation.FreeTextAreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ];
    }

    return pages.filter(page => {
        if (typeof window !== "undefined") {
            // $FlowIgnore
            return !page.getShouldIncludePage || page.getShouldIncludePage()
        }
        return true
    });
}

/*
* An array of pages which require input from the user before current
* category/search results can be shown.
*/
export function getPersonalisationPagesToShow(
    router: $PropertyType<RouterContextObject, 'router'>,
): Array<PersonalisationPage> {
    let pages = getPersonalisationPages(router)

    // Only show page if it haven't already been answered
    return pages.filter(
        page => !page.savedAnswer
    );
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
