/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";

import iss from '../iss';
import BaseCategoriesPage from './BaseCategoriesPage';

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
class BaseResultsPage extends BaseCategoriesPage {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    // flow:disable not supported yet
    get title(): string {
        if (this.props.params.page) {
            return this.category.name;
        } else if (this.props.params.search) {
            return `"${this.props.params.search}"`;
        } else {
            throw new Error("Unexpected");
        }
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
    get results(): Array<iss.issService> {
        var objects;

        if (this.state.objects) {
            objects = Array.from(this.state.objects);
        } else {
            objects = [];
        }

        /* splice in an info box if it exists */
        try {
            var infobox = this.category.info;

            if (infobox) {
                objects.splice(1, 0, {
                    infobox: true,
                    node: infobox,
                });
            }
        } catch (e) {
        }

        return objects;
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
        var request = this.search;

        for (var item of this.personalisationComponents) {
            request = item.getSearch(request);

            if (!request) {
                this.replaceWith(this.getPath() + '/personalise');
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
                    var data = JSON.parse(response.text);
                    this.setState({
                        error: data.error_message,
                    });
                } catch (e) {
                    this.setState({
                        error: `An error occurred (${response.status})`,
                    });
                }

            });
    }

    async loadMore(): Promise<void> {
        if (!this.state.meta && this.state.meta.next) {
            return;
        }

        var next = this.state.meta.next;

        /* reenable the search spinner */
        this.setState({meta: null});

        try {
            var data = await iss.requestObjects(next);
            this.setState({
                meta: data.meta,
                objects: this.state.objects.concat(data.objects),
                error: undefined,
            });

        } catch (response) {
            try {
                var data = JSON.parse(response.text);
                this.setState({
                    error: data.error_message,
                });
            } catch (e) {
                this.setState({
                    error: `An error occurred (${response.status})`,
                });
            }
        }
    }
}

export default BaseResultsPage;
