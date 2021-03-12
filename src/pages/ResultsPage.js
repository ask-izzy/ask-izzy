/* @flow */

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import storage from "../storage";
import sendEvent from "../google-tag-manager";

import routerContext from "../contexts/router-context";
import type {searchResultsMeta, Service} from "../iss";

type State = {
    searchMeta: ?searchResultsMeta,
    searchResults: ?Array<Service>,
    searchError: ?{message: string, status: number},
    searchPagesLoaded: number,
    searchType: ?string,
}


class ResultsPage<ChildProps = {...}, ChildState = {...}>
    extends BaseCategoriesPage<ChildProps, State & ChildState> {
    constructor(props: Object, context: Object) {
        super(props, context);

        const textSearchPage = this.context.router.match.path
            .match(/^\/search\/:search/)
        const searchType =
            this.category && "category" ||
            textSearchPage && "text"

        this.state = {
            ...super.state,
            searchMeta: null,
            searchResults: null,
            searchError: null,
            searchPagesLoaded: 0,
            searchType,
        };
    }

    static contextType = routerContext;

    _component: any;

    componentDidMount(): void {
        super.componentDidMount();

        sendEvent({
            event: "searchResults",
            searchQuery: this.context.router.match.params.search,
            searchPage: this.context.router.match.params.page,
            location: storage.getLocation(),
        });

        if (!this.issParams()) {
            const sep = this.context.router
                .match
                .url
                .endsWith("/") ? "" : "/";

            this.context.router.history.replace(
                `${this.context.router.match.url}${sep}personalise`
            );
        } else {
            this.loadNextSearchPage()
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
            sendEvent({
                event: "LoadMoreSearchResults",
                searchQuery: this.context.router.match.params.search,
                searchPage: this.context.router.match.params.page,
                location: storage.getLocation(),
            });
        }

        this.setState(prevState => ({
            searchMeta: res.meta,
            searchResults: res.objects,
            searchError: undefined,
            searchPagesLoaded: prevState.searchPagesLoaded + 1,
        }));
    }
    loadNextSearchPage = this.loadNextSearchPage.bind(this)

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
