/* @flow */
import React from "react"
import objectHash from "object-hash"
import type { NextRouter } from "next/router"

import {
    createServiceSearch,
} from "@/src/iss/serviceSearch";
import type {
    PaginatedSearch,
} from "@/src/iss/serviceSearch";
import {
    getSearchQueryModifiers,
    buildSearchQueryFromModifiers,
} from "@/src/iss/searchQueryBuilder"
import type {SearchQuery, SearchQueryModifier}
from "@/src/iss/searchQueryBuilder"
import * as gtm from "@/src/google-tag-manager";

import Service from "@/src/iss/Service"
import {attachTransportTimes} from "@/src/iss/travelTimes"
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "@/src/utils/page-loading"
import storage from "@/src/storage";
import type {SortType} from "@/src/components/base/Dropdown"
import type {travelTimesStatus} from "@/src/hooks/useTravelTimesUpdater";
import {
    setLocationFromUrl,
} from "@/src/utils/personalisation"
import {
    getCategoryFromRouter,
    getPageTitleFromRouter,
    getPersonalisationNextPath,
} from "@/src/utils/routing"
import type {categoryType} from "@/src/constants/Category";
import WhoIsLookingForHelpPage
from "@/src/constants/personalisation-pages/WhoIsLookingForHelp.js"
import { usersnapFireEvent } from "@/helpers/usersnap.helpers.js"
import WhoIsLookingForHelpBaseInfo from
"@/src/constants/personalisation-pages/WhoIsLookingForHelp"
import type { UserType } from "@/components/pages/personalisation/WhoIsLookingForHelp"

type Props = {
    router: NextRouter
}

type State = {
    search: ?PaginatedSearch,
    searchStatus: "loading" | "error" | "some loaded" |
        "all loaded",
    searchResults: ?Array<Service>,
    searchError: ?{message: string, status: number},
    searchType: ?string,
    sortBy: ?SortType,
    travelTimesStatus: travelTimesStatus,
    category: categoryType,
    pageTitle: string,
}

const previousSearchHashStorageKey = "previousSearchHash"
const previousSearchDateStorageKey = "previousSearchDate"

class ResultsPage<ChildProps = {...}, ChildState = {...}>
    extends React.Component<Props & ChildProps, State & ChildState> {
    constructor(props: Object, context: Object) {
        super(props, context);
        addPageLoadDependencies(props.router.asPath, "resultsLoad")

        const category = getCategoryFromRouter(props.router)

        if (!category) {
            throw Error("Could not get category for route")
        }

        this.state = {
            ...super.state,
            searchStatus: "loading",
            searchResults: null,
            searchError: null,
            sortOption: null,
            searchType: "true",
            category,
            pageTitle: getPageTitleFromRouter(props.router),
        };
    }

    componentDidMount() {
        if (this.props.router.isReady) {
            this.initSearch()
            usersnapFireEventPageView()
        }
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (
            this.props.router.isReady &&
                (this.props.router !== prevProps.router)
        ) {
            // router ready here when loading the page for the first time
            this.initSearch()
            usersnapFireEventPageView()
        }
    }

    _component: any;

    initSearch(): void {
        const {router} = this.props
        setLocationFromUrl(router)


        const pathWithPersonalisationIfNeeded =
            getPersonalisationNextPath({router})

        if (pathWithPersonalisationIfNeeded !== router.asPath) {
            router.replace(pathWithPersonalisationIfNeeded)
            return
        }

        const query = this.getIssSearchQuery()
        if (!query) {
            throw Error(
                "Something wack has happened here. It doesn't look like we " +
                "have any unfilled out personalisation pages so we should be " +
                "able to generate a query but we can't."
            )
        }
        const search = createServiceSearch(query)
        this.setState({ search }, this.loadFirstPage)
    }

    async loadFirstPage() {
        const { search } = this.state
        const { router } = this.props

        if (!search) {
            throw Error("loadFirstPage() called before search query is created")
        }
        // If the search already had loaded services that means we're using
        // a cached search so no need to load the first page of services.
        if (search.loadedServices.length > 0) {
            this.setState({
                searchStatus: search.isNext ? "some loaded" : "all loaded",
                searchResults: search.loadedServices,
                searchError: undefined,
            });
            closePageLoadDependencies(
                router.asPath,
                "resultsLoad"
            )
        } else {
            await this.loadNextSearchPage()
            closePageLoadDependencies(
                router.asPath,
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
            this.props.router.asPath,
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
                this.props.router.asPath,
                `requestServices`
            )
        }

        if (this.queryChangedSinceLastFetch(search)) {
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
        let modifiers = getSearchQueryModifiers(this.props.router);

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

function usersnapFireEventPageView() {
    const userType = ((storage.getItem(WhoIsLookingForHelpBaseInfo.name): any): UserType);
    if (userType === "User Worker") {
        usersnapFireEvent("viewed-results-page")
    }
}
