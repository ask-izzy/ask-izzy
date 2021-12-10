/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import AppBar from "../components/AppBar";
import ResultsList from "../components/ResultsList";
import ResultsPage from "./ResultsPage";
import SitesMap from "../components/SitesMap";
import NotFoundStaticPage from "./NotFoundStaticPage";
import Loading from "../icons/loading.svg";

import type { site } from "../iss/site";
import Service from "../iss/Service"

import ScreenReader from "../components/ScreenReader";
import GeolocationButtonForTravelTimes from
    "../components/GeolocationButtonForTravelTimes";

type State = {
    selectedSite: ?site,
}

class ResultsMapPage extends ResultsPage<{}, State> {
    services(): Array<Service> {
        if (!this.state.searchResults) {
            return [];
        }

        return this.state.searchResults.filter(
            service => !service.location?.isConfidential() &&
                !service.crisis
        );
    }

    get sites(): Array<site> {
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

    getSiteServices(site: site): Array<Service> {
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
                <Loading className="big" />
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
                    servicesToUpdateTravelTimes={this.selectedServices}
                    onTravelTimesStatusChange={
                        travelTimesStatus => this.setState({travelTimesStatus})
                    }
                    showMessage={false}
                />
                <ResultsList
                    crisisResults={false}
                    travelTimesStatus={this.state.travelTimesStatus}
                    results={this.selectedServices}
                    sortBy={undefined}
                />
            </>
        }
    }

}

export default ResultsMapPage;
