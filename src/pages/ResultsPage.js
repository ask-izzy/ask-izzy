/* @flow */
import React from "react"
import objectHash from "object-hash"

import {
    createServiceSearch,
} from "../iss/serviceSearch";
import type {
    PaginatedSearch,
} from "../iss/serviceSearch";
import {
    getSearchQueryModifiers,
    buildSearchQueryFromModifiers,
} from "../iss/searchQueryBuilder"
import type {SearchQuery, SearchQueryModifier} from "../iss/searchQueryBuilder"
import * as gtm from "../google-tag-manager";

import routerContext from "../contexts/router-context";
import Service from "../iss/Service"
import {attachTransportTimes} from "../iss/travelTimes"
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "../utils/page-loading"
import storage from "../storage";
import type {SortType} from "../components/base/Dropdown"
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import {
    getPersonalisationPagesToShow,
    getCategoryFromRouter,
    getPageTitleFromRouter,
    setLocationFromUrl,
} from "../utils/personalisation"
import Category from "../constants/Category"

type State = {
    search: ?PaginatedSearch,
    searchStatus: "loading" | "error" | "some loaded" |
        "all loaded",
    searchResults: ?Array<Service>,
    searchError: ?{message: string, status: number},
    searchType: ?string,
    sortBy: ?SortType,
    travelTimesStatus: travelTimesStatus,
    category: ?Category,
    pageTitle: string,
}

const previousSearchHashStorageKey = "previousSearchHash"
const previousSearchDateStorageKey = "previousSearchDate"

class ResultsPage<ChildProps = {...}, ChildState = {...}>
    extends React.Component<ChildProps, State & ChildState> {
    constructor(props: Object, context: Object) {
        super(props, context);
        addPageLoadDependencies(context.router.location, "resultsLoad")

        const isTextSearchPage = !!context.router.match.params.search
        const category = getCategoryFromRouter(context.router)
        const searchType =
            category && "category" ||
            isTextSearchPage && "text"

        let search = null
        if (typeof window !== "undefined") {
            const query = this.getIssSearchQuery()
            if (query) {
                search = createServiceSearch(query)
            }
        }

        this.state = {
            ...super.state,
            search,
            searchStatus: "loading",
            searchResults: null,
            searchError: null,
            sortOption: null,
            searchType,
            category,
            pageTitle: getPageTitleFromRouter(context.router),
        };
    }

    static contextType: typeof routerContext = routerContext;

    _component: any;

    componentDidMount(): void {
        setLocationFromUrl(this.context.router)

        const personalisationPagesToShow = getPersonalisationPagesToShow(
            this.context.router
        )

        if (personalisationPagesToShow.length > 0) {
            closePageLoadDependencies(
                this.context.router.location,
                "resultsLoad"
            )
            const newPath =
                this.context.router.location.pathname.replace(/\/$/, "") +
                "/personalise"
            this.context.router.navigate(newPath, {replace: true});
        } else if (this.state.search) {
            const search = this.state.search
            // If the search already had loaded services that means we're using
            // a cached search so no need to load the first page of services.
            if (search.loadedServices.length > 0) {
                this.setState({
                    searchStatus: search.isNext ? "some loaded" : "all loaded",
                    searchResults: search.loadedServices,
                    searchError: undefined,
                });
                closePageLoadDependencies(
                    this.context.router.location,
                    "resultsLoad"
                )
            } else {
                this.loadNextSearchPage.bind(this)().then(
                    () => closePageLoadDependencies(
                        this.context.router.location,
                        "resultsLoad"
                    )
                )
            }
        } else {
            closePageLoadDependencies(
                this.context.router.location,
                "resultsLoad"
            )
        }
    }

    async loadNextSearchPage(): Promise<void> {
        const search = this.state.search
        if (this.state.searchStatus === "all loaded" || !search) {
            return
        }
        addPageLoadDependencies(
            this.context.router.location,
            `requestServices`
        )

        try {
            this.setState({searchStatus: "loading"});
            await search.loadNextPage()
        } catch (error) {
            this.setState({
                searchError: error,
                searchStatus: "some loaded",
            });
            console.error(
                "The following error occurred when trying to load next page"
            )
            console.error(error)
            return
        } finally {
            closePageLoadDependencies(
                this.context.router.location,
                `requestServices`
            )
        }

        if (this.queryChangedSinceLastFetch(search)) {
            const whoIsLookingForHelp = String(storage.getItem(
                // WhoIsLookingForHelpPage.defaultProps.name
                "who-is-looking-for-help"
            ))
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

        this.setState({
            searchStatus: search.isNext ? "some loaded" : "all loaded",
            searchResults: search.loadedServices,
            searchError: undefined,
        });

        if (storage.getSearchArea()) {
            try {
                attachTransportTimes(search.loadedServices)
                // Update state to force re-render
                this.setState(state => ({
                    ...state,
                    searchResults: state.searchResults &&
                        [...state.searchResults],
                }))
            } catch (error) {
                // We don't currently do anything if fetching travel times fails
            }
        }
    }

    queryChangedSinceLastFetch(search: PaginatedSearch): boolean {
        let queryChangedSinceLastFetch = true

        const previousSearchHash = storage.getItem(
            previousSearchHashStorageKey
        );
        const previousSearchDateString = storage.getItem(
            previousSearchDateStorageKey
        );
        const previousSearchDate = previousSearchDateString &&
            new Date(previousSearchDateString)

        const searchHash = objectHash(search.issQuery)
        const oneDayAgo = Date.now() - 1000 * 60 * 60 * 24;

        if (
            previousSearchHash === searchHash &&
            previousSearchDate &&
            previousSearchDate > oneDayAgo
        ) {
            queryChangedSinceLastFetch = false
        }

        storage.setItem(previousSearchHashStorageKey, searchHash, true);
        storage.setItem(previousSearchDateStorageKey, Date.now(), true);

        return queryChangedSinceLastFetch
    }

    getIssSearchQuery(): SearchQuery | null {
        // Build the search request.
        //
        // If we don't have enough information to build the search request
        // trigger the personalisation wizard.
        //
        // We have to do this once the component is mounted (instead of
        // in willTransitionTo because the personalisation components will
        // inspect the session).
        let modifiers = getSearchQueryModifiers(this.context.router);

        if (modifiers.includes(null)) {
            return null
        }
        // Cast because flow is stupid and doesn't know that
        // searchQueryModifiers won't contain null at this point.
        modifiers = ((modifiers: any): SearchQueryModifier[])

        return buildSearchQueryFromModifiers(modifiers);
    }

    get searchIsLoading(): boolean {
        return this.state.searchStatus === "loading"
    }

    get searchHasNextPage(): boolean {
        return this.state.searchStatus === "some loaded"
    }

}

export default ResultsPage;
