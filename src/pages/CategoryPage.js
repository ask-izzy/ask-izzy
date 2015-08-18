/* @flow */

import http from 'iso-http';
import mui from "material-ui";
import React from 'react';
import Router from 'react-router';
import url from 'url';

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

    async search(): Object {
        /* issue a search to ISS */
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
                q: this.props.params.categoryName,
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
    }

    render(): React.Element {
        return (
            <div>
                <Router.RouteHandler />
                <mui.AppBar title={this.props.params.categoryName} />

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
