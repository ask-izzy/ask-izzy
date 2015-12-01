/* @flow */

import React from "react";
import { History } from "react-router";
import reactMixin from "react-mixin";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import icons from "../icons";

import AppBar from "../components/AppBar";
import ButtonListItem from "../components/ButtonListItem";
import ResultsMap from "../components/ResultsMap";
import ResultsListPage from "./ResultsListPage";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class ResultsPage extends BaseCategoriesPage {

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
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
            request = item.getSearch(request);

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
                    this.setState({
                        error: `An error occurred (${response.statusCode})`,
                        statusCode: response.statusCode,
                    });
                }

            });
    }

    // flow:disable not supported yet
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
                objects: this.state.objects.concat(data.objects),
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
                    error: `An error occurred (${response.status})`,
                });
            }
        }
    }

    onBackClick(event: SyntheticInputEvent): void {
        if (this.refs.component.onGoBack) {
            this.refs.component.onGoBack(event)
        }
        // FIXME: Convert back buttons to links
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

                <Component
                    ref="component"
                    {...this.state}
                    {...this.props}
                    category={this.category}
                    search={this.props.params.search}
                    loadMore={this.renderLoadMore()}
                    title={this.title}
                    loading={this.loading}
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
                    onTouchTap={this.loadMore.bind(this)}
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
    // flow:disable until flow can track inheritance for ReactComponent
    component(): ReactComponent {
        return ResultsListPage;
    }

    backButtonMessage(): string {
        return "Categories"
    }
}

export class ResultsPageMap extends ResultsPage {
    // flow:disable until flow can track inheritance for ReactComponent
    component(): ReactComponent {
        return ResultsMap;
    }

    backButtonMessage(): string {
        // FIXME: Should be category name if no marker is selected
        return ""
    }
}
