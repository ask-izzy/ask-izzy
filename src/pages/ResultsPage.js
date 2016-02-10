/* @flow */

import React from "react";
import { History } from "react-router";
import reactMixin from "react-mixin";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import icons from "../icons";
import storage from "../storage";
import sendEvent from "../google-tag-manager";

import AppBar from "../components/AppBar";
import ButtonListItem from "../components/ButtonListItem";
import ResultsMap from "../components/ResultsMap";
import DebugContainer from "../components/DebugContainer";
import DebugSearch from "../components/DebugSearch";
import ResultsListPage from "./ResultsListPage";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class ResultsPage extends BaseCategoriesPage {

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

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
            if (typeof item.getSearch == "function") {
                request = item.getSearch(request);

                if (!request) {
                    return null;
                }
            }
        }

        return request;
    }

    componentDidMount(): void {
        // Update the URL to include the location, so that links
        // are SEO-friendly. If we dont have a location but the
        // URL does, use the one from the url.
        const {suburb, state} = this.props.params;

        if (suburb && state && !storage.getLocation()) {
            // Use the location from the URL since
            // we haven't got one in personalisation.
            storage.setLocation(`${suburb}, ${state}`);
            storage.setCoordinates(null);
        } else if (storage.getLocation()) {
            // We have a location in localStorage, use that instead.
            const [newSuburb, newState] = storage.getLocation().split(", ");

            if (newSuburb && newState) {
                const newUrlLocation = `${newSuburb}-${newState}`;
                let parts = this.props.location.pathname.split("/");

                if (suburb && state) {
                    // The url already includes '/in'
                    parts.splice(3, 2, "in", newUrlLocation)
                } else {
                    parts.splice(3, 0, "in", newUrlLocation);
                }

                this.history.replaceState(
                    null,
                    parts.join("/"),
                    ""
                );
            }
        }

        sendEvent({
            "event": "searchResults",
            "searchQuery": this.props.params.search,
            "searchPage": this.props.params.page,
            "location": storage.getLocation(),
        })

        const request = this.issParams();

        if (!request) {
            const sep = this
                .props
                .location
                .pathname
                .endsWith("/") ? "" : "/";

            this.history.replaceState(
                null,
                `${this.props.location.pathname}${sep}personalise`,
                ""
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
                    console.error(response);

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
        if (!this.state.meta && this.state.meta.next) {
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

    onBackClick(event: SyntheticInputEvent): void {
        if (this.refs.component.onGoBack) {
            this.refs.component.onGoBack(event)
        }

        if (!event.defaultPrevented) {
            this.props.history.pushState(
                null,
                "/",
                {}
            );
        }
    }

    render(): ReactElement {
        const Component = this.component();

        return (
            <div className="ResultsPage">
                <AppBar
                    title={this.title}
                    backMessage={this.backButtonMessage()}
                    onBackTouchTap={this.onBackClick.bind(this)}
                />
                <DebugContainer>
                    <DebugSearch search={this.issParams()} />
                </DebugContainer>

                <Component
                    ref="component"
                    {...this.state}
                    {...this.props}
                    category={this.category}
                    search={this.props.params.search}
                    loadMore={this.renderLoadMore()}
                    title={this.title}
                    loading={this.loading}
                    personalisationComponents={this.personalisationComponents}
                />
            </div>
        );
    }

    renderLoadMore(): ?ReactElement {
        if (this.state.meta && this.state.meta.next) {
            return (
                <ButtonListItem
                    className="MoreResultsButton"
                    primaryText="Load more results…"
                    onClick={this.loadMore.bind(this)}
                />
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

}

export default ResultsPage;

export class ResultsPageListing extends ResultsPage {

    component(): ReactClass {
        return ResultsListPage;
    }

    backButtonMessage(): string {
        return "Categories"
    }
}

export class ResultsPageMap extends ResultsPage {

    component(): ReactClass {
        return ResultsMap;
    }

    backButtonMessage(): string {
        // FIXME: Should be category name if no marker is selected
        return ""
    }
}
