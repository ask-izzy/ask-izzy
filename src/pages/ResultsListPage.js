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
import * as iss from '../iss';
import categories from '../constants/categories';
import Infobox from '../components/Infobox';
import ResultListItem from '../components/ResultListItem';
import HeaderBar from '../components/HeaderBar';

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
/*::`*/@reactMixin.decorate(Router.State)/*::`;*/
class ResultsListPage extends React.Component {
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

    // flow:disable not supported yet
    get title(): string {
        if (this.props.params.page) {
            return this.category.name;
        } else if (this.props.params.search) {
            return `"${this.props.params.search}"`;
        }
    }

    // flow:disable not supported yet
    get search(): string {
        if (this.props.params.page) {
            return this.category.search;
        } else if (this.props.params.search) {
            return this.props.params.search;
        }
    }

    // flow:disable not supported yet
    get results(): Array<Object> {
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
        var location = sessionstorage.getItem('location');

        if (!location) {
            console.log("Need location");
            this.replaceWith('location', null,
                             {next: this.getPath()});
        }

        /* if we have coordinates add them to the request */
        var coordinates = null;
        try {
            coordinates = JSON.parse(sessionstorage.getItem('coordinates'));
        } catch (e) {
        }

        iss.search(location, coordinates, this.search)
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
            <div className="ResultsListPage">
                <mui.AppBar
                    className="AppBar"
                    title={this.title}
                    iconElementLeft={
                        <mui.IconButton
                            className="BackButton"
                            onTouchTap={this.goBack.bind(this)}
                        >
                            <NavigationArrowBack />
                        </mui.IconButton>
                    }
                />

                <HeaderBar
                    primaryText={
                        this.state.meta ?
                            <div>
                                I found {this.state.meta.total_count}{' '}
                                {this.title.toLocaleLowerCase()}{' '}
                                services for{' '}
                                {this.state.meta.location.name},{' '}
                                {this.state.meta.location.state}.
                                <icons.LogoLight className="Logo" />
                            </div>
                        :
                            <div>Searching...</div>
                    }
                    secondaryText={
                        <div>
                            <Router.Link
                                to="location"
                                query={{
                                    next: this.getPath(),
                                }}
                            >Change what you need</Router.Link>
                         </div>
                    }
                />

                {this.state.meta || this.state.error ?
                    ''
                :
                    <div className="progress">
                        <mui.CircularProgress mode="indeterminate" />
                    </div>
                }

                {this.state.error ?
                    <div>
                        {this.state.error}
                    </div>
                : ''
                }

                <mui.List className="List results">{
                    this.results.map((object, index) =>
                        object.infobox ?
                            <div key={index}>
                                {React.addons.cloneWithProps(object.node)}
                            </div>
                        :
                            <ResultListItem object={object} key={index} />
                    )
                }</mui.List>
            </div>
        );
    }

}

export default ResultsListPage;
