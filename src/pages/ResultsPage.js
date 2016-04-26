/* @flow */

import React from "react";

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

class ResultsPage extends BaseCategoriesPage {

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

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
        super.componentDidMount();

        sendEvent({
            event: "searchResults",
            searchQuery: this.props.params.search,
            searchPage: this.props.params.page,
            location: storage.getLocation(),
        });

        const request = this.issParams();

        if (!request) {
            const sep = this
                .props
                .location
                .pathname
                .endsWith("/") ? "" : "/";

            this.context.router.replace(
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
                    console.error(response, response.stack);

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
        sendEvent({
            event: "LoadMoreSearchResults",
            searchQuery: this.props.params.search,
            searchPage: this.props.params.page,
            location: storage.getLocation(),
        });

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
            this.context.router.push(
                "/",
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
