/* @flow */
import type { RouterContextObject } from "../contexts/router-context";
import type {
    PersonalisationPage,
} from "../../flow/personalisation-page"
import {getCategory} from "../constants/categories";
import personalisation from "../constants/personalisation-pages";
import {getSavedPersonalisationAnswer} from "./personalisation"
import Category from "../constants/Category";

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
    } else {
        console.error("Current route involves no personalisation pages")
    }

    return pages.filter(page => {
        if (typeof window !== "undefined") {
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
        page => !getSavedPersonalisationAnswer(page)
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
        return page.name === currentPageName
    });

    return index >= 0 ? index : null
}

export function currentRouteIsPersonalised(
    router: $PropertyType<RouterContextObject, 'router'>
): boolean {
    const category = getCategory(
        router.match.params.page
    )
    return Boolean(category || router.match.params.search)
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