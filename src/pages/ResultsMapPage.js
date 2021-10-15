/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import AppBar from "../components/AppBar";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsList from "../components/ResultsList";
import ResultsPage from "./ResultsPage";
import SitesMap from "../components/SitesMap";
import NotFoundStaticPage from "./NotFoundStaticPage";
import icons from "../icons";

import type { Service, Site } from "../iss";
import ScreenReader from "../components/ScreenReader";
import GeolocationButtonForTravelTimes from
    "../components/GeolocationButtonForTravelTimes";
import Storage from "../storage";

type State = {
    selectedSite: ?Site,
}

class ResultsMapPage extends ResultsPage<{}, State> {
    services(): Array<Service> {
        if (!this.state.searchResults) {
            return [];
        }

        return this.state.searchResults.filter(
            service => !service.Location().isConfidential() &&
                !service.crisis
        );
    }

    get sites(): Array<Site> {
        const sites = []
        const siteIds = {}
        for (const {site} of this.services()) {
            const id = site.id.toString()
            if (!siteIds[id]) {
                sites.push(site)
                siteIds[id] = true
            }

        }
        return sites
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

    calculateMapHeight(): ?string {
        if (typeof window === "undefined" || !this.state.selectedSite) {
            return undefined;
        }

        /* calculate the height of the map */

        let mapHeight =
            window.innerHeight -
            (document.querySelector(".AppBarContainer")?.offsetHeight || 0);

        /* resize the map to make room
            * for the selected results */
        mapHeight -= 150 * this.selectedServices.length;

        /* limit minimum height to 1/2 of the screen real estate */
        mapHeight = Math.max(mapHeight,
            window.innerHeight / 2);

        return `${mapHeight}px`;
    }

    render(): ReactElement<"div"> | ReactNode {
        if (this.state.searchType) {
            return this.renderPage()
        }

        return <NotFoundStaticPage/>
    }

    renderPage: (() => ReactElement<"div">) = () => (
        <div className="ResultsMapPage">
            <AppBar transition={false}/>
            <DebugContainer message="Debug personalisation">
                <DebugPersonalisation
                    search={this.search}
                    items={this.personalisationComponents}
                />
            </DebugContainer>
            <DebugContainer message="ISS Parameters">
                <DebugSearch search={this.issParams()} />
            </DebugContainer>
            <main aria-labelledby="mapResults">
                <ScreenReader>
                    <span id="mapResults">
                        Map of search results.
                    </span>
                </ScreenReader>
                {this.renderPageBody()}
            </main>

        </div>
    )

    renderPageBody(): ReactNode | ReactElement<"div"> {
        if (this.searchIsLoading) {
            return <div className="progress">
                <icons.Loading className="big" />
            </div>
        } else {
            return <>
                <div
                    className="map"
                    style={{
                        flexBasis: this.calculateMapHeight() || "auto",
                        // On IE11 `display:contents` doesn't work so the map
                        // doesn't show. This is to set the height of the map
                        // if a service is selected it's 60vh otherwise 100vh
                        height: this.state.selectedSite ? "60vh" : "90vh",
                    }}
                >
                    <SitesMap
                        onSiteSelect={
                            site => {
                                // Setting it null first will ensure
                                // that the new travel times get loaded
                                // When switching between sites without
                                // closing the previous one
                                this.setState({selectedSite: null}, () => {
                                    this.setState({selectedSite: site})
                                })
                            }
                        }
                        sites={this.sites}
                        siteLocations={this.siteLocations}
                        selectedSite={this.state.selectedSite}
                    />
                </div>
                <GeolocationButtonForTravelTimes
                    fetchedLocation={!!Storage.getCoordinates()}
                    onGeoLocationSuccess={
                        this.onGeoLocationSuccess.bind(this)
                    }
                    showMessage={false}
                />
                <ResultsList
                    reFetchTravelTimes={!!(!!Storage.getCoordinates() &&
                    this.state.selectedSite)}
                    results={this.selectedServices}
                />
            </>
        }
    }

}

export default ResultsMapPage;
