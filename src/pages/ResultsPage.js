/* @flow */

import * as React from "react";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import icons from "../icons";
import storage from "../storage";
import * as gtm from "../google-tag-manager";

import AppBar from "../components/AppBar";
import ButtonListItem from "../components/ButtonListItem";
import ResultsMap from "../components/ResultsMap";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsListPage from "./ResultsListPage";
import routerContext from "../contexts/router-context";

import type { Service } from "../iss";
import NotFoundStaticPage from "./NotFoundStaticPage"

class ResultsPage extends BaseCategoriesPage {
    constructor(props: Object) {
        super(props);
        this.state = {
            isClient: false,
            childServices: [],
        };
    }

    static contextType = routerContext;

    _component: any;
    _childComponent: any;

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
            request.service_type = ["disability advocacy"]
            request.q = "disability"
        }

        return request;
    }

    componentDidMount(): void {
        super.componentDidMount();

        this.setState({ isClient: true });

        gtm.emit({
            event: "searchResults",
            searchQuery: decodeURIComponent(
                this.context.router.match.params.search
            ),
            searchPage: this.context.router.match.params.page,
            location: storage.getLocation(),
        });

        const request = this.issParams();

        if (!request) {
            const sep = this
                .props
                .location
                .pathname
                .endsWith("/") ? "" : "/";

            this.context.router.history.replace(
                `${this.props.location.pathname}${sep}personalise`
            );
            return;
        }

        iss.search(request)
            .then(data => {
                this.setState({
                    meta: data.meta,
                    objects: data.objects,
                    error: undefined,
                });
            })

            .catch(response => {
                try {
                    console.error(response)
                    console.error(response.stack);

                    let data = JSON.parse(response.body);

                    this.setState({
                        error: data.error_message,
                        statusCode: response.statusCode,
                    });
                } catch (error) {
                    console.log(error)
                    this.setState({
                        error: `An error occurred. Please try again.`,
                        statusCode: response.statusCode,
                    });
                }

            });
    }

    get loading(): boolean {
        return !(this.state.meta || this.state.error);
    }

    async loadMore(): Promise<void> {
        gtm.emit({
            event: "LoadMoreSearchResults",
            searchQuery: decodeURIComponent(
                this.context.router.match.params.search
            ),
            searchPage: this.context.router.match.params.page,
            location: storage.getLocation(),
        });

        gtm.emit({
            event: "Load More Search Results Clicked",
            eventCat: "Content Expanded",
            eventAction: "Load More Search Results",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        }, "GTM-54BTPQM");

        if (!(this.state.meta && this.state.meta.next)) {
            return;
        }

        let next = this.state.meta.next;
        let data;

        /* reenable the search spinner */
        this.setState({meta: null});

        try {
            data = await iss.requestObjects(next);

            this.setState({
                meta: data.meta,
                objects: data.objects,
                error: undefined,
            });

        } catch (response) {
            try {
                data = JSON.parse(response.body);
                this.setState({
                    error: data.error_message,
                });
            } catch (error) {
                this.setState({
                    error: `An error occurred (${
                        response.statusCode || error
                    })`,
                    statusCode: response.statusCode,
                });
            }
        }
    }

    onBackClick(event: SyntheticInputEvent<>): void {
        if (this._childComponent && this._childComponent.onGoBack) {
            this._childComponent.onGoBack(event);
        }

        if (this._component.onGoBack) {
            this._component.onGoBack(event);
        }

        if (!event.defaultPrevented) {
            this.context.router.history.push("/");
        }
    }

    onServicesChange(services: Array<Service>) {
        this.setState({ childServices: services });
    }

    component(): React.ComponentType<any> {
        throw new Error("Override this class to implement `component`");
    }

    render() {
        const Component = this.component();

        if (!this.category &&
            (this.search.q === "undefined-search")) {
            return (
                <NotFoundStaticPage/>
            )
        }

        return (
            <div className="ResultsPage">
                <AppBar
                    title={this.title}
                    backMessage={this.backButtonMessage()}
                    onBackTouchTap={this.onBackClick.bind(this)}
                />
                <DebugContainer message="Debug personalisation">
                    <DebugPersonalisation
                        search={this.search}
                        items={this.personalisationComponents}
                    />
                </DebugContainer>
                <DebugContainer message="ISS Parameters">
                    <DebugSearch search={this.issParams()} />
                </DebugContainer>

                <Component
                    ref={elem => {
                        this._component = elem
                    }}
                    {...this.state}
                    {...this.props}
                    category={this.category}
                    search={decodeURIComponent(
                        this.context.router.match.params.search
                    )}
                    loadMore={this.renderLoadMore()}
                    title={this.title}
                    loading={this.loading}
                    personalisationComponents={this.personalisationComponents}
                    // The below props are only used for the ResultsMap
                    // component - this is because react-google-maps >= 6.0.0
                    // introduced a HOC to initialise the Google Map
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                        <div
                            style={
                                { height: `${this.calculateMapHeight()}px` }
                            }
                        />
                    }
                    mapElement={<div style={{ height: `100%` }} />}
                    childRef={elem => {
                        this._childComponent = elem
                    }}
                    onServicesChange={this.onServicesChange.bind(this)}
                />
            </div>
        );
    }

    calculateMapHeight(): number {
        const selectedServices = this.state.childServices || [];
        let mapHeight = 2000;

        if (!this.state.isClient) {
            return mapHeight;
        }

        try {
            /* calculate the height of the map */
            /* TODO: Find why flow doesn't like the offsetHeight here
               Might be because the DOM isn't actually rendered? */

            mapHeight =
                window.innerHeight -
                // $FlowIgnore
                document.querySelector(".AppBar").offsetHeight;

            /* resize the map to make room
             * for the selected results */
            mapHeight -= 150 * selectedServices.length;

            /* limit minimum height to 1/2 of the screen realestate */
            mapHeight = Math.max(mapHeight,
                window.innerHeight / 2);
        } catch (error) {
            //
        }

        return mapHeight;
    }

    renderLoadMore() {
        if (this.state.meta && this.state.meta.next) {
            return (
                <div className="moreResultsContainer">
                    <ButtonListItem
                        className="MoreResultsButton"
                        primaryText="See more results"
                        onClick={this.loadMore.bind(this)}
                    />
                </div>
            );
        }

        if (this.loading) {
            return (
                <div className="progress">
                    <icons.Loading className="big" />
                </div>
            );
        }
    }

    backButtonMessage(): string {
        // FIXME: Should be category name if no marker is selected
        return ""
    }

}

export default ResultsPage;

export class ResultsPageListing extends ResultsPage {

    component(): React.ComponentType<any> {
        return ResultsListPage;
    }

    backButtonMessage(): string {
        return "Home Page"
    }
}

export class ResultsPageMap extends ResultsPage {

    component(): React.ComponentType<any> {
        return ResultsMap;
    }
}
