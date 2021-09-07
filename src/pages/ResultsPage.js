/* @flow */

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import * as gtm from "../google-tag-manager";

import routerContext from "../contexts/router-context";
import type {searchResultsMeta, Service} from "../iss";
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "../utils/page-loading"

type State = {
    searchMeta: ?searchResultsMeta,
    searchResults: ?Array<Service>,
    searchError: ?{message: string, status: number},
    searchPagesLoaded: number,
    searchType: ?string,
    fetchedLocation: boolean,
}


class ResultsPage<ChildProps = {...}, ChildState = {...}>
    extends BaseCategoriesPage<ChildProps, State & ChildState> {
    constructor(props: Object, context: Object) {
        super(props, context);
        addPageLoadDependencies(context.router.location, "resultsLoad")

        const isTextSearchPage = !!this.context.router.match.params.search
        const searchType =
            this.category && "category" ||
            isTextSearchPage && "text"

        this.state = {
            ...super.state,
            searchMeta: null,
            searchResults: null,
            searchError: null,
            searchPagesLoaded: 0,
            fetchedLocation: false,
            searchType,
        };
    }

    static contextType: typeof routerContext = routerContext;

    _component: any;

    componentDidMount(): void {
        super.componentDidMount();

        if (!this.issParams()) {
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
        let res
        try {
            if (!this.state.searchMeta) {
                const params = this.issParams()
                if (!params) {
                    return
                }
                // first page
                this.setState({searchMeta: null});
                res = await iss.search(params)

            } else if (this.state.searchMeta.next) {
                const next = this.state.searchMeta.next
                // subsequent pages
                this.setState({searchMeta: null});
                res = await iss.requestObjects(next);

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
            searchResults: res.objects,
            searchError: undefined,
            searchPagesLoaded: prevState.searchPagesLoaded + 1,
        }));
    }
    loadNextSearchPage: () => Promise<void> = this.loadNextSearchPage.bind(this)

    issParams(): ?Object {
        // Build the search request.
        //
        // If we don't have enough information to build the search request
        // trigger the personalisation wizard.
        //
        // We have to do this once the component is mounted (instead of
        // in willTransitionTo because the personalisation components will
        // inspect the session).
        let request = this.search;

        for (let item of this.personalisationComponents) {
            // TODO: This needs to be debugged with the new flow version
            // $FlowIgnore
            if (typeof item.getSearch === "function") {
                // $FlowIgnore
                request = item.getSearch(request);

                if (!request) {
                    return null;
                }
            }
        }

        // A special case for the "Find advocacy" button on the
        // DisabilityAdvocacyFinder page.
        if (request.q === "Disability Advocacy Providers") {
            request.service_type_raw = ["disability advocacy"]
            request.q = "disability"
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
