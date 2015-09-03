/* @flow */

"use strict";

import React from 'react';
import Router from "react-router";
import mui from "material-ui";

import BaseResultsPage from "./BaseResultsPage";
import ResultListItem from '../components/ResultListItem';
import components from '../components';
import icons from '../icons';

class ResultsListPage extends BaseResultsPage {
    render(): React.Element {
        return (
            <div className="ResultsListPage">
                <components.AppBar
                    title={this.title}
                    onBackTouchTap={this.goBack.bind(this)}
                />

                <components.HeaderBar
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

                <mui.List className="List results">
                {
                    this.state.objects ?
                        <mui.ListItem
                            className="ViewOnMap"
                            primaryText="View on a map"
                            containerElement={
                                <Router.Link
                                    to={this.getPathname() + '/map'}
                                />
                            }
                            leftIcon={
                                <icons.Map />
                            }
                            rightIcon={
                                <icons.Chevron />
                            }
                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    :
                        ''
                }
                {
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
