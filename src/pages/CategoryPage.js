/* @flow */

import http from 'iso-http';
import mui from "material-ui";
import React from 'react';
import Router from 'react-router';
import url from 'url';

import ResultTile from '../components/ResultTile';

class CategoryPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    search(callback): void {
        /* issue a search to ISS */
        let url_ = url.parse(ISS_URL || process.env.ISS_URL);
        let auth = url_.auth;

        url_.auth = null;
        url_.pathname = '/api/v3/search/';
        url_ = url.format(url_);

        http.request({
            url: url_,
            contentType: 'application/json',
            withCredentials: true,
            data: {
                q: this.props.params.categoryName,
                key: auth,
                type: 'service',
                limit: 3,
            },
        }, response => {
            if (response.status == 200) {
                let data = JSON.parse(response.text);
                this.setState({
                    meta: data.meta,
                    objects: data.objects,
                });
            } else {
                console.log("SOMETHING BAD HAPPENED");
                console.log(response);
            }
        });
    }

    componentDidMount(): void {
        this.search(state => {
            this.setState(state);
        });
    }

    componentWillReceiveProps(nextProps: Object): void {
        this.setState({ categoryName: nextProps.params.categoryName });
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
