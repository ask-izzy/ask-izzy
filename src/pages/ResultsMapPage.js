/* @flow */

import React from "react";

import AppBar from "../components/AppBar";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsList from "../components/ResultsList";
import ResultsPage from "./ResultsPage";
import ResultsMap from "../components/ResultsMap";
import NotFoundStaticPage from "./NotFoundStaticPage"

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
}

class ResultsMapPage extends ResultsPage<Props, State> {
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
            .forEach(site => {
                sites[site.id.toString()] = site
            })
        return (Object.values(sites): any)
    }

    get siteLocations(): Object {
        const locations = {}
        for (const service of this.services()) {
            locations[service.site.id.toString()] = service.location
        }
        return locations
    }

    getSiteServices(site: Site): Array<Service> {
        return this.services()
            .filter(service => service.site.id === site.id)
    }

    get selectedServices(): Array<Service> {
        if (this.state.selectedSite) {
            return this.getSiteServices(this.state.selectedSite)
        }

        return []
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

            mapHeight =
                window.innerHeight -
                (document.querySelector(".AppBarContainer")?.offsetHeight || 0);

            /* resize the map to make room
             * for the selected results */
            mapHeight -= 150 * this.selectedServices.length;

            /* limit minimum height to 1/2 of the screen real estate */
            mapHeight = Math.max(mapHeight,
                window.innerHeight / 2);
        } catch (error) {
            //
        }

        return mapHeight;
    }

    render() {
        if (this.state.searchType) {
            return this.renderPage()
        }

        return <NotFoundStaticPage/>
    }

    renderPage = () => (
        <div className="ResultsMapPage">
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
                    search={decodeURIComponent(
                        this.context.router.match.params.search
                    )}
                    title={this.title}
                    personalisationComponents={this.personalisationComponents}
                    // The below props are only used for the ResultsMap
                    // component - this is because react-google-maps >= 6.0.0
                    // introduced a HOC to initialise the Google Map
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                        <div
                            style={
                                { height: `${this.calculateMapHeight()}px` }
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
    )

}

export default ResultsMapPage;