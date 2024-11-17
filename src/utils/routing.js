/* @flow */
import type {
    PersonalisationPage,
} from "../../flow/personalisation-page"
import {getCategory} from "../constants/categories";
import {getSavedPersonalisationAnswer} from "./personalisation"
import Category from "@/src/constants/Category";
import storage from "../storage";

import type { NextRouter } from "next/router"

/*
* An array of pages used in the process of personalising the current
* category/search.
*/
export function getPersonalisationPages(
    router: NextRouter,
): Array<PersonalisationPage> {
    const category = getCategoryFromRouter(router)
    if (!category) {
        console.error("Current route involves no personalisation pages")
        return []
    }
    return getPersonalisationPagesFromCategory(category)
}

export function getPersonalisationPagesFromCategory(
    category: Category,
): Array<PersonalisationPage> {
    return category.personalisation.filter(page => {
        if (typeof window !== "undefined") {
            return !page.getShouldIncludePage || page.getShouldIncludePage(category)
        }
        return true
    });
}

/*
* An array of pages which require input from the user before current
* category/search results can be shown.
*/
export function getPersonalisationPagesToShow(
    router: NextRouter,
): Array<PersonalisationPage> {
    let pages = getPersonalisationPages(router)

    return getPersonalisationPagesToShowFromPages(pages)
}

export function getPersonalisationPagesToShowFromCategory(
    category: Category,
): Array<PersonalisationPage> {
    let pages = getPersonalisationPagesFromCategory(category)

    return getPersonalisationPagesToShowFromPages(pages)
}

export function getPersonalisationPagesToShowFromPages(
    pages: Array<PersonalisationPage>
): Array<PersonalisationPage> {
    return pages.filter(
        page => !getSavedPersonalisationAnswer(page)
    );
}

export function getCurrentPersonalisationPage(
    router: NextRouter,
): ?PersonalisationPage {
    const pages = getPersonalisationPages(router)
    const index = getCurrentPersonalisationPageIndex(
        router,
        pages
    )
    return typeof index === "number" ? pages[index] : null;
}

export function getCurrentPersonalisationPageIndex(
    router: NextRouter,
    personalisationPages: Array<PersonalisationPage>
): ?number {
    const currentPageName = router.query.personalisationSlug
    const index = personalisationPages.findIndex(page => {
        return page.name === currentPageName
    });

    return index >= 0 ? index : null
}

export function currentRouteIsPersonalised(
    router: NextRouter
): boolean {
    const category = getCategoryFromRouter(router)
    return Boolean(category)
}

export function getCategoryFromRouter(
    router: NextRouter
): ?Category {
    return getCategory(
        router.query.categoryOrContentPageSlug || router.route.split("/")[1]
    )
}

export function getPageTitleFromRouter(
    router: NextRouter
): string {
    if (router.query.search) {
        const search = decodeURIComponent(
            router.query.search
        );
        return `“${search.replace(/["']/g, "")}”`
    }

    const category = getCategoryFromRouter(router)

    if (!category) {
        console.warn("Tried to get page title from route without category")
        return "undefined-search";
    }
    return category.name;
}

// router.asPath won't always match when rendered client-side vs server-side,
// for example if a rewrite is used. In these circumstances we may wish to
// use the path as it would appear server-side during the initial stage of
// the client-side render to ensure a successfully hydration. Next.js doesn't
// appear to tell us what this would be but we can figure it out pretty easily
// by filling in the route path with the current params.
export function getPathOfSSRPage(
    router: NextRouter
): string {
    return convertRouteToPath(router.pathname, router.query)
}

export function convertRouteToPath(
    route: string,
    params: {[string]: [string]}
): string {
    // $FlowIgnore polyfill for replaceAll is imported in _app.js
    return route.replaceAll(
        /\[([^/\]]+?)\]/g,
        (fullMatch, param) => {
            if (!(param in params)) {
                console.error(
                    `Trying to convert a route to a path but missing ` +
                        `param "${param}"`,
                    params,
                )
            }
            return params[param]
        }
    )
}

type getServicesPathProps = {|
    router: NextRouter,
    category?: Category | string,
    personalisationPage?: PersonalisationPage,
    personalisationPagesToIgnore?: Array<PersonalisationPage> | "all",
    map?: boolean,
    summary?: boolean,
    searchText?: string,
    location?: string,
    pageMounted?: boolean,
|}
// The only reason this is too complex is because Ask Izzy's routes are too
// complex :/
// Previously however this logic was spread out all though out out Ask Izzy.
// Now having it in once place at least means we only have to make sure this
// code generates the correct paths to ensure that all places which rely on this
// function will get the correct path.
// eslint-disable-next-line complexity
export function getServicesPath({
    router,
    category,
    personalisationPage,
    personalisationPagesToIgnore,
    map,
    summary,
    searchText,
    location,
    pageMounted = true,
}: getServicesPathProps): string {
    // If a value is not given then set it based on the current route
    if (category === undefined) {
        category = getCategoryFromRouter(router) ?? undefined
    } else if (typeof category === "string") {
        category = getCategory(category) ?? undefined
    }
    if (map === undefined) {
        map = router.pathname.includes("/map")
    }
    if (summary === undefined) {
        summary = router.pathname.includes("/summary")
    }
    if (searchText === undefined && pageMounted) {
        if (router.query.search) {
            searchText = decodeURIComponent(router.query.search)
        } else if (router.query.helpSpecialisation) {
            searchText = decodeURIComponent(router.query.helpSpecialisation)
        }
    }
    if (location === undefined && pageMounted) {
        location = storage.getSearchArea();
    }
    if (!category) {
        throw new Error("No category")
    }

    // Begin constructing the new route
    const pathSegments = ["", category.key]

    if (["search", "disability-advocacy-finder"].includes(category.key) && searchText) {
        pathSegments.push(searchText)
    }

    if (location) {
        pathSegments.push(location.replace(", ", "-"))
    }

    if (map) {
        pathSegments.push("map")
    }

    if (!personalisationPage) {
        const personalisationPages =
            getPersonalisationPagesToShowFromCategory(category)
                .filter(page => {
                    if (!pageMounted || personalisationPagesToIgnore === "all") {
                        return false
                    } else if (personalisationPagesToIgnore) {
                        return !personalisationPagesToIgnore.includes(page)
                    }
                    return true
                })
        personalisationPage = personalisationPages[0]
    }

    if (personalisationPage || summary) {
        pathSegments.push("personalise")
    }
    if (summary) {
        pathSegments.push("summary")
    }
    if (personalisationPage && !summary) {
        pathSegments.push("page")
    }
    if (personalisationPage) {
        pathSegments.push(personalisationPage.name)
    }

    return pathSegments.map(encodeURIComponent).join("/")
}


export function getPersonalisationNextPath(args: getServicesPathProps): string {
    const {router} = args
    let {personalisationPagesToIgnore} = args
    if (!personalisationPagesToIgnore) {
        const category = typeof args.category === "object" ?
            args.category
            : getCategory(args.category || "")
        const currentPersonalisationPage = category && (category === getCategoryFromRouter(router)) ?
            getCurrentPersonalisationPage(router)
            : null
        personalisationPagesToIgnore = currentPersonalisationPage ?
            [currentPersonalisationPage]
            : []
    }
    return getServicesPath({
        ...args,
        personalisationPagesToIgnore,
    })
}

export function goToPersonalisationNextPath(
    args: getServicesPathProps
): void {
    const {router} = args
    router.push(getPersonalisationNextPath(args))
}

export function getPersonalisationBackPath(
    router: NextRouter,
): string {
    const newPath = getServicesPath({
        router,
        personalisationPagesToIgnore: "all",
    })
    if (newPath === router.asPath) {
        return "/"
    }
    return newPath
}
