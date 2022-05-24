/* @flow */

import type {
    Node as ReactNode,
    Element as ReactElement,
    ElementConfig as ReactElementConfig,
} from "React";
import React from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import AppBar from "@/src/components/AppBar";
import ResultsList from "@/src/components/ResultsList";
import ResultsPage from "@/components/pages/ResultsPage";
import SitesMap from "@/src/components/SitesMap";
import NotFoundStaticPage from "@/src/../pages/404";
import icons from "@/src/icons";

import type { site } from "@/src/iss/site";
import Service from "@/src/iss/Service"

import GeolocationButtonForTravelTimes from
"@/src/components/GeolocationButtonForTravelTimes";
import { goToPersonalisationNextPath } from "@/src/utils/routing"

type Props = {
    router: NextRouter
}

type State = {
    selectedSite: ?site,
}

class ResultsMapPage extends ResultsPage<Props, State> {
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
            <AppBar
                transition={false}
                onBackTouchTap={() => goToPersonalisationNextPath({
                    router: this.props.router,
                    map: false,
                })}
                backMessage="Back to results list"
            />
            <main aria-label="Map of search results">
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
                    resultsLoading={this.searchIsLoading}
                    sortBy={undefined}
                />
            </>
        }
    }

}

export default (
    withRouter(ResultsMapPage):
        Class<
            React$Component<
                $Diff<
                    ReactElementConfig<typeof ResultsMapPage>,
                    {router: *}
                >
            >
        >
)