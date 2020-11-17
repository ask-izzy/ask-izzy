/* @flow */

import React from "react";
import PropTypes from "proptypes";
import _ from "underscore";

import AppBar from "../components/AppBar";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsList from "../components/ResultsList";
import ResultsPage from "./ResultsPage";
import ResultsMap from "../components/ResultsMap";

import * as gtm from "../google-tag-manager";
import storage from "../storage";
import type { Service, Site } from "../iss";
import type Category from "../constants/Category";

type Props = {
    loadMore: any,
    objects: Array<Service>,
    location: any,
    personalisationComponents: Array<Object>,
    title: string,
    statusCode: number,
    meta: {total_count: number},
    loading: boolean,
    error: string,
    category?: Category,
    search?: {search: string},
}

type State = {
    selectedSite: ?Site,
    mapHeight: number,
}

class ResultsMapPage extends ResultsPage<Props, State> {
    componentDidMount(): void {
        super.componentDidMount();
        this.setState({mapHeight: this.calculateMapHeight()})
    }
    componentDidUpdate(prevProps: Object, prevState: Object) {
        if (this.state.selectedSite !== prevState.selectedSite) {
            this.setState({mapHeight: this.calculateMapHeight()})
        }
    }

    services(): Array<Service> {
        if (!this.state.searchResults) {
            return [];
        }

        return this.state.searchResults.filter(
            service => !service.Location().isConfidential()
        );
    }

    get sites(): Array<Site> {
        const sites = {}
        this.services()
            .map(service => service.site)
            .forEach(site => sites[site.id.toString()] = site)
        return (Object.values(sites): any)  
    }

    get siteLocations(): Object {
        const locations = {}
        this.services()
            .forEach(service => 
                locations[service.site.id.toString()] = service.location
            )
        return locations  
    }

    getSiteServices(site: Site): Array<Service> {
        return this.services()
            .filter(service => service.site.id === site.id)
    }

    get selectedServices(): Array<Service> {
        if (this.state.selectedSite) {
            return this.getSiteServices(this.state.selectedSite)
        } else {
            return []
        }
    }

    onBackClick = (event: SyntheticInputEvent<>): void => {
        event.preventDefault()
        if (this.state.selectedSite) {
            this.setState({selectedSite: null})
        } else {
            this.context.router.history.goBack();
        }
    }

    calculateMapHeight(): number {
        let mapHeight = 500;

        if (typeof window === "undefined") {
            return mapHeight;
        }

        try {
            /* calculate the height of the map */
            /* TODO: Find why flow doesn't like the offsetHeight here
               Might be because the DOM isn't actually rendered? */

            mapHeight =
                window.innerHeight -
                // flow:disable
                document.querySelector(".AppBarContainer").offsetHeight;

            /* resize the map to make room
             * for the selected results */
            mapHeight -= 150 * this.selectedServices.length;

            /* limit minimum height to 1/2 of the screen realestate */
            mapHeight = Math.max(mapHeight,
                window.innerHeight / 2);
        } catch (error) {
            //
        }

        return mapHeight;
    }

    render() {
        return (
            <div className="ResultsPage">
                <AppBar
                    title={this.title}
                    onBackTouchTap={this.onBackClick}
                />
                <DebugContainer message="Debug personalisation">
                    <DebugPersonalisation
                        search={this.search}
                        items={this.personalisationComponents}
                    />
                </DebugContainer>
                <DebugContainer message="ISS Parameters">
                    <DebugSearch search={this.issParams()} />
                </DebugContainer>

                <div className="ResultsMap">
                    <ResultsMap
                        {...this.props}
                        category={this.category}
                        search={decodeURIComponent(this.context.router.match.params.search)}
                        title={this.title}
                        loading={this.loading}
                        personalisationComponents={this.personalisationComponents}
                        // The below props are only used for the ResultsMap
                        // component - this is because react-google-maps >= 6.0.0
                        // introduced a HOC to initialise the Google Map
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={
                            <div
                                style={
                                    { height: `${this.state.mapHeight}px` }
                                }
                            />
                        }
                        mapElement={<div style={{ height: `100%` }} />}
                        onSiteSelect={site => this.setState({selectedSite: site})}
                        sites={this.sites}
                        siteLocations={this.siteLocations}
                        services={this.services()}
                    />
                    <ResultsList results={this.selectedServices} />
                </div>
            </div>
        );
    }
}

export default ResultsMapPage;