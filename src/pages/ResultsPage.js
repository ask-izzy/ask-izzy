/* @flow */
import React from "react"

import {
    createServiceSearch
} from "../iss/serviceSearch";
import type {
    serviceSearchResultsMeta,
} from "../iss/serviceSearch";
import {getSearchQueryModifiers} from "../iss/searchQueryBuilder"
import {buildSearchQueryFromModifiers} from "../iss/searchQueryBuilder"
import type {SearchQuery} from "../iss/searchQueryBuilder"
import * as gtm from "../google-tag-manager";

import routerContext from "../contexts/router-context";
import Service from "../iss/Service"
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "../utils/page-loading"
import storage from "../storage";
import type {SortType} from "../components/base/Dropdown"
import type {travelTimesStatus} from "../hooks/useTravelTimesUpdater";
import {
    getPersonalisationPages,
    getPersonalisationPagesToShow,
    getCategoryFromRouter,
    getPageTitleFromRouter,
    setLocationFromUrl,
} from "../utils/personalisation"
import Category from "../constants/Category"

type State = {
    search: ?serviceSearchResultsMeta,
    searchStatus: "loading" | "error" | "some loaded" | "all loaded" | "not finished",
    searchResults: ?Array<Service>,
    searchError: ?{message: string, status: number},
    searchPagesLoaded: number,
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
            searchPagesLoaded: 0,
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

        console.log('hii', personalisationPagesToShow)

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
            this.loadNextSearchPage().then(
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

            console.log('hi1', query)

            if (
                storage.getDebug() &&
                storage.getJSON("issParamsOverride")
            ) {
                query = storage.getJSON("issParamsOverride")
            }
            console.log('hi2', query)

            if (!query) {
                return
            }

            if (!query.term) {
                this.setState({
                    searchStatus: 'not finished',
                    searchError: query
                })
                return
            }
            // first page
            search = createServiceSearch(query)
            this.setState({search});

        }

        try {
            console.log(search)
            this.setState({searchStatus: 'loading'});
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

        if (search.pagesLoaded > 1) {
            gtm.emit({
                event: "Load More Search Results Clicked",
                eventCat: "Content Expanded",
                eventAction: "Load More Search Results",
                eventLabel: location.pathname,
                sendDirectlyToGA: true,
            });
        }

        console.log('--hii', search.loadedServices)

        this.setState({
            searchStatus: "some loaded",
            searchResults: search.loadedServices,
            searchError: undefined,
            searchPagesLoaded: search.pagesLoaded,
        });
    }
    loadNextSearchPage: () => Promise<void> = this.loadNextSearchPage.bind(this)

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

        console.log('mods', modifiers, buildSearchQueryFromModifiers(modifiers))

        return buildSearchQueryFromModifiers(modifiers);
    }

    get searchIsLoading(): boolean {
        return this.state.searchStatus === 'loading'
    }

    get searchHasNextPage(): boolean {
        return this.state.searchStatus !== 'all loaded'
    }

}

export default ResultsPage;
