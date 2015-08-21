/* @flow */

"use strict";

import mui from "material-ui";
import React from 'react';
import _ from 'underscore';

import iss from '../iss';
import categories from '../constants/categories';
import ResultTile from '../components/ResultTile';
import HeaderBar from '../components/HeaderBar';

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
    get category(): categories.Category {
        if (this._category) {
            return this._category;
        }

        var category = _.findWhere(categories, {
            key: this.props.params.page,
        });

        if (category === undefined) {
            throw "No such category " + this.props.params.page;
        }

        this._category = category;
        return category;
    }

    componentDidMount(): void {
        iss('search/', {
            q: this.category.search,
            type: 'service',
            area: 'melbourne vic',  // FIXME: get real location
            limit: 3,
        })
            .then(data => {
                this.setState({
                    meta: data.meta,
                    objects: data.objects,
                    error: undefined,
                });
            }).catch(error => {

                this.setState({
                    error: error,
                });
            });

    }

    render(): React.Element {
        if (this.state.error) {
            return (
                <div>
                    { this.state.error }
                </div>
            );
        }

        return (
            <div>
                <mui.AppBar title={this.category.name} />

                <HeaderBar
                    primaryText={this.category.name}
                    secondaryText={<a href="#">Try a different search</a>}
                />

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
