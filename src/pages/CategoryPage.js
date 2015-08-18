/* @flow */

import http from 'iso-http';
import mui from "material-ui";
import React from 'react';
import Router from 'react-router';
import url from 'url';

import categories from '../constants/categories';
import ResultTile from '../components/ResultTile';

declare var ISS_URL: string;

/**
 * request:
 * obj: data passed to http.request
 *
 * Wraps the http request code in a promise.
 *
 * Returns: a promise for the request
 */
function request(obj) {
    return new Promise((resolve, reject) => {
        http.request(obj, response => {
            if (response.status == 200) {
                resolve(response);
            } else {
                reject(response);
            }
        });
    });
}

class CategoryPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    /**
     * category:
     *
     * Return category information.
     */

    // flow:disable not supported yet
    get category(): Object {
        if (this._category) {
            return this._category;
        }

        for (var category of categories) {
            if (category.key == this.props.params.page) {
                this._category = category;
                return category;
            }
        }

        throw "No such category " + this.props.params.page;
    }

    /**
     * search:
     * Do a search in ISS
     *
     * Returns: a promise to an object of data from ISS.
     */
    async search(): Object {
        var url_: string = ISS_URL || process.env.ISS_URL;

        var urlobj: Object = url.parse(url_);
        var auth = urlobj.auth;

        urlobj.auth = null;
        urlobj.pathname = '/api/v3/search/';
        url_ = url.format(urlobj);

        var response = await request({
            url: url_,
            contentType: 'application/json',
            withCredentials: true,
            data: {
                q: this.category.search,
                key: auth,
                type: 'service',
                limit: 3,
            },
        });

        return JSON.parse(response.text);
    }

    componentDidMount(): void {
        this.search()
            .then(data => {
                this.setState({
                    meta: data.meta,
                    objects: data.objects,
                });
            });

        // FIXME: display error
    }

    render(): React.Element {
        return (
            <div>
                <Router.RouteHandler />
                <mui.AppBar title={this.category.name} />

                <mui.List>{
                    // FIXME: crisis tiles
                    (this.state.objects || []).map((object, index) => {
                        return <ResultTile object={object} key={index} />;
                    })
                }</mui.List>
            </div>
        );
    }

}

export default CategoryPage;
