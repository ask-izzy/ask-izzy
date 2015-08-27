/* @flow */

"use strict";

import { GoogleMap } from "react-google-maps";
import React from 'react';
import Router from "react-router";
import NavigationArrowBack from
    "material-ui/lib/svg-icons/navigation/arrow-back";
import mui from "material-ui";

import BaseResultsPage from "./BaseResultsPage";
import HeaderBar from '../components/HeaderBar';
import ResultListItem from '../components/ResultListItem';
import Maps from '../maps';

class ResultsMapPage extends BaseResultsPage {
    componentDidMount(): void {
        super.componentDidMount();

        /* request the Google Maps API */
        Maps().then(() => {
            this.setState({mapsLoaded: true});
        });
    }

    render(): React.Element {
        return (
            <div className="ResultsMapPage">
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
                <div className="Map">{
                    /* we can't create the map component until the API promise
                     * resolves */
                    this.state.mapsLoaded ?
                        <GoogleMap
                            defaultCenter={{
                                lat: -34.397,
                                lng: 150.644,
                            }}
                            defaultZoom={4}
                        >
                        </GoogleMap>
                    : ''
                }</div>
            </div>
        );
    }

}

export default ResultsMapPage;
