/* @flow */
import React from "react"

import {
    initialSearchForServices,
    searchForServices,
} from "../iss/serviceSearch";
import type {
    serviceSearchRequest,
    serviceSearchResultsMeta,
} from "../iss/serviceSearch";
import {getInitialSearchRequest} from "../iss/serviceSearch"
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
    searchMeta: ?serviceSearchResultsMeta,
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
            searchMeta: null,
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
        addPageLoadDependencies(
            this.context.router.location,
            `requestServices`
        )
        let res
        try {
            if (!this.state.searchMeta) {
                let params = this.issParams()

                if (
                    storage.getDebug() &&
                    storage.getJSON("issParamsOverride")
                ) {
                    params = storage.getJSON("issParamsOverride")
                }

                if (!params) {
                    return
                }
                // first page
                this.setState({searchMeta: null});
                res = await initialSearchForServices(params)

            } else if (this.state.searchMeta.next) {
                const next = this.state.searchMeta.next
                // subsequent pages
                this.setState({searchMeta: null});
                res = await searchForServices(next);

            } else {
                // no more pages
                return
            }
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

        if (this.state.searchPagesLoaded > 0) {
            gtm.emit({
                event: "Load More Search Results Clicked",
                eventCat: "Content Expanded",
                eventAction: "Load More Search Results",
                eventLabel: location.pathname,
                sendDirectlyToGA: true,
            });
        }

        this.setState(prevState => ({
            searchMeta: res.meta,
            searchResults: res.services,
            searchError: undefined,
            searchPagesLoaded: prevState.searchPagesLoaded + 1,
        }));
    }
    loadNextSearchPage: () => Promise<void> = this.loadNextSearchPage.bind(this)

    issParams(): ?serviceSearchRequest {
        // Build the search request.
        //
        // If we don't have enough information to build the search request
        // trigger the personalisation wizard.
        //
        // We have to do this once the component is mounted (instead of
        // in willTransitionTo because the personalisation components will
        // inspect the session).
        let request = getInitialSearchRequest(this.context.router);

        const personalisationPages = getPersonalisationPages(
            this.context.router
        )
        for (let item of personalisationPages) {
            if (typeof item.getSearch === "function") {
                request = item.getSearch(request);

                if (!request) {
                    return null;
                }
            }
        }

        return request;
    }

    get searchIsLoading(): boolean {
        return !this.state.searchError && !this.state.searchMeta;
    }

    get searchHasNextPage(): boolean {
        return !!this.state.searchMeta?.next
    }

}

export default ResultsPage;
