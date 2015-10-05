/* @flow */

import React from "react";
import Router from "react-router";
import reactMixin from "react-mixin";
import _ from "underscore";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";

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
        var objects, index;

        if (this.state.objects) {
            objects = Array.from(this.state.objects);
        } else {
            objects = [];
        }

        // Infoboxes are no longer inline (moved to headers). Keeping this
        // code as @danni pointed out it's not likely to revert cleanly.
        //
        // /* splice in an infobox (if it exists) after the first non-crisis
        //  * service */
        /*
        try {
            var infobox = this.category.info;

            index = _.findIndex(objects,
                                object => !object.crisis && !object.infobox);

            if (infobox && index != -1) {
                objects.splice(index + 1, 0, {
                    infobox: true,
                    node: infobox,
                });
            }
        } catch (error) {
            // pass
        }
        */
        /* splice a header before the first crisis service */
        index = _.findIndex(objects, object => object.crisis);
        if (index != -1) {
            /* count hotlines */
            var nhotlines = _.where(objects, {crisis: true}).length;

            objects.splice(index, 0, {
                staticText: true,
                node: (
                    <h3 className="CrisisHeader">
                    {nhotlines == 1 ?
                      "If you need urgent help call this number"
                    : "If you need urgent help call one of these numbers"}
                    </h3>
                ),
            });
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
                this.replaceWith(this.getPath() + "/personalise");
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

                    var data = JSON.parse(response.text);

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

    async loadMore(): Promise<void> {
        if (!this.state.meta && this.state.meta.next) {
            return;
        }

        var next = this.state.meta.next;
        var data;

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
}

export default BaseResultsPage;
