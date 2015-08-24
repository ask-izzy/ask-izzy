/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import NavigationArrowBack from
    "material-ui/lib/svg-icons/navigation/arrow-back";
import _ from 'underscore';
import mui from "material-ui";
import reactMixin from "react-mixin";
import sessionstorage from "sessionstorage";

import icons from '../icons';
import iss from '../iss';
import categories from '../constants/categories';
import ResultTile from '../components/ResultTile';
import HeaderBar from '../components/HeaderBar';

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
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
        var location = sessionstorage.getItem('location');

        if (!location) {
            console.log("Need location");
            this.replaceWith('location', null,
                             {next: this.getPath()});
        }

        iss('search/', {
            q: this.category.search,
            type: 'service',
            area: location || 'melbourne vic',
            catchment: true,
            limit: 3,
        })
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

    render(): React.Element {
        return (
            <div>
                <mui.AppBar
                    className="AppBar"
                    title={this.category.name}
                    iconElementLeft={
                        <mui.IconButton
                            onTouchTap={this.goBack.bind(this)}
                        >
                            <NavigationArrowBack />
                        </mui.IconButton>
                    }
                />

                {
                    this.state.meta ? <HeaderBar
                        primaryText={
                            <div>
                                I found {this.state.meta.total_count}{' '}
                                {this.category.name.toLocaleLowerCase()}{' '}
                                services serving{' '}
                                {this.state.meta.location.name},{' '}
                                {this.state.meta.location.state}.
                            </div>
                        }
                        secondaryText={
                            <Router.Link
                                to="location"
                                query={{
                                    next: this.getPath(),
                                }}
                             >Change what you need</Router.Link>
                        } />
                    : <div>
                        // FIXME
                        Loading...
                    </div>
                }

                {this.state.error ?
                    <div>
                        {this.state.error}
                    </div>
                : ''
                }

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
