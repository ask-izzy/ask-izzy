/* @flow */

import http from 'iso-http';
import mui from "material-ui";
import React from 'react';
import Router from 'react-router';

import iss from '../iss';
import categories from '../constants/categories';
import ResultTile from '../components/ResultTile';

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

    componentDidMount(): void {
        iss('search/', {
            q: this.category.search,
            type: 'service',
            limit: 3,
        })
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
