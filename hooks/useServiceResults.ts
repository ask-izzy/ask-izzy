import {useEffect, useState} from "react"
import type { NextRouter } from "next/router"
import objectHash from "object-hash"

import {useServiceResultsContext} from "@/contexts/service-results-context.js"
import Service from "@/src/iss/Service.js"
import {
    createServiceSearch,
} from "@/src/iss/serviceSearch.js";
import {
    PaginatedSearch,
} from "@/src/iss/serviceSearch.js";
import {
    getSearchQueryModifiers,
    buildSearchQueryFromModifiers,
} from "@/src/iss/searchQueryBuilder.js"
import type {SearchQuery, SearchQueryModifier} from "@/src/iss/searchQueryBuilder.js"
import * as gtm from "@/src/google-tag-manager.js";
import {attachTransportTimes} from "@/src/iss/travelTimes.js"
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "@/src/utils/page-loading.js"
import storage from "@/src/storage.js";
import type {SortType} from "@/src/components/base/Dropdown.js"
import type {travelTimesStatus as travelTimesStatusType} from "@/src/hooks/useTravelTimesUpdater.js";
import {
    setLocationFromUrl,
} from "@/src/utils/personalisation.js"
import {
    getCategoryFromRouter,
    getPageTitleFromRouter,
    getPersonalisationNextPath,
} from "@/src/utils/routing.js"
import Category from "@/src/constants/Category.js";
import WhoIsLookingForHelpPage from "@/src/constants/personalisation-pages/WhoIsLookingForHelp.js"
import { usersnapFireEvent } from "@/helpers/usersnap.helpers.js"

type UseServiceResults = {
    searchResults: Array<Service> | null,

    category: Category,

    searchError: {message: string, status: number} | null,
    travelTimesStatus: travelTimesStatusType | null,
    sortBy: SortType | null,
    searchType: string | null,
    pageTitle: string,

    setSortBy: (sortBy: SortType | null) => void,
    setTravelTimesStatus: (travelTimesStatusType) => void,

    searchIsLoading: () => boolean,
    getIssSearchQuery: () => SearchQuery | null,
    searchHasNextPage: () => boolean,
    loadNextSearchPage: () => Promise<void>,
}

const previousSearchHashStorageKey = "previousSearchHash"
const previousSearchDateStorageKey = "previousSearchDate"

export default (router: NextRouter): UseServiceResults => {
    const [searchStatus, setSearchStatus] =
        useState<"loading" | "error" | "some loaded" | "all loaded">("loading")
    const [searchResults, setSearchResults] = useState<Array<Service> | null>(null)
    const [searchError, setSearchError] = useState<{message: string, status: number} | null>(null)
    const [searchType] = useState<string | null>("true")
    const [sortBy, setSortBy] = useState<SortType | null>(null)

    const [category] = useState<Category>(getCategory())
    const [pageTitle] = useState<string>(getPageTitleFromRouter(router))

    const {
        search,
        setSearch,
        travelTimesStatus,
        setTravelTimesStatus,
    } = useServiceResultsContext()

    useEffect(() => {
        if (router.isReady) {
            if (!search) {
                initSearch()
            }
            // router ready here when loading the page for the first time
            usersnapFireEventPageView()
        }
    }, [router.isReady, router.asPath])

    useEffect(() => {
        if (router.isReady) {
            // router ready here when loading the page for the first time
            // this event is independent from the loading results event
            usersnapFireEventPageView()
        }
    }, [router.isReady])


    useEffect(() => {
        if (search) {
            loadFirstPage()
        }
    }, [search])



    function getCategory(): Category {
        const categoryFromRouter = getCategoryFromRouter(router)
        if (!categoryFromRouter) {
            throw Error("Could not get category for route")
        }
        return categoryFromRouter
    }

    function initSearch(): void {
        setLocationFromUrl(router)

        const pathWithPersonalisationIfNeeded =
            getPersonalisationNextPath({router})

        if (pathWithPersonalisationIfNeeded !== router.asPath) {
            router.replace(pathWithPersonalisationIfNeeded)
            return
        }

        const query = getIssSearchQuery()
        if (!query) {
            throw Error(
                "Something wack has happened here. It doesn't look like we " +
                "have any unfilled out personalisation pages so we should be " +
                "able to generate a query but we can't.",
            )
        }
        const serviceSearch = createServiceSearch(query)
        setSearch(serviceSearch)

    }

    function loadFirstPage() {
        if (!search) {
            throw Error("loadFirstPage() called before search query is created")
        }
        // If the search already had loaded services that means we're using
        // a cached search so no need to load the first page of services.
        if (search.loadedServices.length > 0) {
            setSearchStatus(search.isNext ? "some loaded" : "all loaded")
            setSearchResults(search.loadedServices)
            setSearchError(null)
        } else {
            loadNextSearchPage()
        }
    }

    async function loadNextSearchPage(): Promise<void> {
        if (searchStatus === "all loaded" || !search) {
            return
        }
        addPageLoadDependencies(
            router.asPath,
            `requestServices`,
        )

        try {
            setSearchStatus("loading")
            await search.loadNextPage()
        } catch (error) {
            setSearchError(error)
            setSearchStatus("some loaded")
            console.error(
                "The following error occurred when trying to load next page",
            )
            console.error(error)
            return
        } finally {
            closePageLoadDependencies(
                router.asPath,
                `requestServices`,
            )
        }

        if (queryChangedSinceLastFetch(search)) {
            const whoIsLookingForHelp = storage.getItem(WhoIsLookingForHelpPage.name)
            gtm.emit({
                event: "Action Triggered - New Search",
                eventCat: "Action triggered",
                eventAction: "New search request",
                eventLabel: whoIsLookingForHelp ?
                    whoIsLookingForHelp
                    : "<not answered>",
                sendDirectlyToGA: true,
            });
        }
        setSearchStatus(search.isNext ? "some loaded" : "all loaded")
        setSearchResults(search.loadedServices)

        setSearchError(null)

        if (storage.getSearchArea()) {
            try {
                attachTransportTimes(search.loadedServices)

            } catch (error) {
                // We don't currently do anything if fetching travel times fails
            }
        }
    }

    function queryChangedSinceLastFetch(search: PaginatedSearch): boolean {
        let queryChangedSinceLastFetch = true

        const previousSearchHash = storage.getItem(
            previousSearchHashStorageKey,
        );
        const previousSearchDateString = storage.getItem(
            previousSearchDateStorageKey,
        );
        const previousSearchDate = previousSearchDateString &&
            new Date(previousSearchDateString)

        const searchHash = objectHash(search.issQuery)
        const oneDayAgo = Date.now() - 1000 * 60 * 60 * 24;

        if (
            previousSearchHash === searchHash &&
            previousSearchDate &&
            (previousSearchDate as any) > oneDayAgo
        ) {
            queryChangedSinceLastFetch = false
        }

        storage.setItem(previousSearchHashStorageKey, searchHash, true);
        storage.setItem(previousSearchDateStorageKey, Date.now(), true);

        return queryChangedSinceLastFetch
    }

    function getIssSearchQuery(): SearchQuery | null {
        // Build the search request.
        //
        // If we don't have enough information to build the search request
        // trigger the personalisation wizard.
        //
        // We have to do this once the component is mounted (instead of
        // in willTransitionTo because the personalisation components will
        // inspect the session).
        const modifiers = getSearchQueryModifiers(router);

        if (modifiers.includes(null)) {
            return null
        }

        return buildSearchQueryFromModifiers(modifiers as SearchQueryModifier[])
    }

    function searchIsLoading(): boolean {
        return searchStatus === "loading"
    }

    function searchHasNextPage(): boolean {
        return searchStatus === "some loaded"
    }


    return {
        searchResults,
        pageTitle,
        category,
        searchIsLoading,
        searchError,
        travelTimesStatus,
        sortBy,
        searchType,

        setSortBy,
        setTravelTimesStatus,

        getIssSearchQuery,
        searchHasNextPage,
        loadNextSearchPage,
    }
}

function usersnapFireEventPageView() {
    const userType = storage.getItem(WhoIsLookingForHelpPage.name)
    if (userType === "User Worker") {
        usersnapFireEvent("viewed-results-page")
    }
}