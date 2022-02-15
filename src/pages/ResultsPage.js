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
import Service from "../services/Service"
import {attachTransportTimes} from "../services/travelTimes"
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "../utils/page-loading"
import storage, {
    previousSearchHashStorageKey,
    previousSearchDateStorageKey,
} from "../storage";
import type {SortType} from "../components/base/Dropdown"
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import {
    getPersonalisationPagesToShow,
    getCategoryFromRouter,
    getPageTitleFromRouter,
    setLocationFromUrl,
} from "../utils/personalisation"
import Category from "../constants/Category"
import WhoIsLookingForHelpPage from
    "../pages/personalisation/WhoIsLookingForHelp"

type State = {
    search: ?PaginatedSearch,
    searchStatus: "loading" | "error" | "some loaded" |
        "all loaded" | "not finished",
    searchResults: ?Array<Service>,
    searchError: ?{message: string, status: number},
    searchType: ?string,
    sortBy: ?SortType,
    travelTimesStatus: travelTimesStatus,
    category: ?Category,
    pageTitle: string,
}


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

        this.state = {
            ...super.state,
            search: null,
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
        } else {
            this.loadNextSearchPage.bind(this)().then(
                () => closePageLoadDependencies(
                    this.context.router.location,
                    "resultsLoad"
                )
            )
        }

    }

    async loadNextSearchPage(): Promise<void> {
        if (this.state.searchStatus === "all loaded") {
            return
        }
        addPageLoadDependencies(
            this.context.router.location,
            `requestServices`
        )
        let search = this.state.search
        if (!search) {
            let query = this.getIssSearchQuery()


            if (!query) {
                return
            }

            // first page
            search = createServiceSearch(query)
            this.setState({search});

        }

        try {
            this.setState({searchStatus: "loading"});
            await search.loadNextPage()
        } catch (error) {
            this.setState({searchError: error});
            try {
                console.error(error)
                console.error(error.stack);

                let data = JSON.parse(error.body);

                console.error("Server response body:")
                console.error(data)
            } catch (parseError) {
                console.error("Server response body could not be parsed:")
                console.error(error?.body)
            }
            return
        } finally {
            closePageLoadDependencies(
                this.context.router.location,
                `requestServices`
            )
        }

        if (this.queryChangedSinceLastFetch(search)) {
            const whoIsLookingForHelp = String(storage.getItem(
                WhoIsLookingForHelpPage.defaultProps.name
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
            searchStatus: "some loaded",
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

        storage.setItem(previousSearchHashStorageKey, searchHash);
        storage.setItem(previousSearchDateStorageKey, Date.now());

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
        return this.state.searchStatus !== "all loaded"
    }

}

export default ResultsPage;
