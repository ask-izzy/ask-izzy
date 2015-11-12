/* @flow */

import React from "react";
import { History } from "react-router";
import reactMixin from "react-mixin";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import ResultsListPage from "./ResultsListPage";
import ResultsMapPage from "./ResultsMapPage";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class BaseResultsPage extends BaseCategoriesPage {

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

                    let data = JSON.parse(response.text);

                    this.setState({
                        error: data.error_message,
                        statusCode: response.status,
                    });
                } catch (error) {
                    this.setState({
                        error: `An error occurred (${response.status})`,
                        statusCode: response.status,
                    });
                }

            });
    }

    // flow:disable not supported yet
    get search(): iss.searchRequest {
        if (this.props.params.page) {
            return Object.assign({}, this.category.search);
        } else if (this.props.params.search) {
            return {
                q: this.props.params.search,
            };
        } else {
            throw new Error("Unexpected");
        }
    }

    // flow:disable not supported yet
    get title(): string {
        if (this.props.params.page) {
            return this.category.name;
        } else if (this.props.params.search) {
            const quote = new RegExp(`["']`, "g");
            const search = this.props.params.search;

            return `“${search.replace(quote, "")}”`;
        } else {
            throw new Error("Unexpected");
        }
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
                data = JSON.parse(response.text);
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

    render(): ReactElement {
        const Component = this
            .props
            .location
            .pathname
            .match(/map(\/)?$/) ? ResultsMapPage : ResultsListPage;

        return (
            <div className="BaseResultsPage">
                <Component
                    {...this.state}
                    {...this.props}
                    title={this.title}
                    loadMore={this.loadMore.bind(this)}
                />
            </div>
        );
    }

}

export default BaseResultsPage;
