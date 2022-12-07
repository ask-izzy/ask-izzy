import React, {useState} from "react"
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import AppBar from "@/src/components/AppBar";
import ResultsList from "@/src/components/ResultsList";
import SitesMap from "@/src/components/SitesMap";
import NotFoundStaticPage from "@/pages/404";
import Loading from "@/src/icons/Loading";
import type { site } from "@/src/iss/site";
import Service from "@/src/iss/Service"
import GeolocationButtonForTravelTimes from "@/src/components/GeolocationButtonForTravelTimes";
import {goToPersonalisationNextPath} from "@/src/utils/routing"
import useServiceResults from "@/hooks/useServiceResults"

type Props = {
    router: NextRouter
}

function ResultsMapPage({router}: Props) {
    const {
        searchResults,
        searchIsLoading,
        travelTimesStatus,
        searchType,
        setTravelTimesStatus,
    } = useServiceResults(router)

    const [selectedSite, setSelectedSite] = useState<site | null>()

    function services(): Array<Service> {
        if (!searchResults) {
            return [];
        }

        return searchResults.filter(
            service => !service.location?.isConfidential() &&
                !service.crisis,
        );
    }

    function getSites(): Array<site> {
        const sites: site[] = []
        const siteIds = {}
        for (const {site} of services()) {
            const id = site.id.toString()
            if (!siteIds[id]) {
                sites.push(site)
                siteIds[id] = true
            }

        }
        return sites
    }

    function getSiteLocations(): Record<string, any> {
        const locations = {}
        for (const service of services()) {
            locations[service.site.id.toString()] = service.location
        }
        return locations
    }

    function getSiteServices(site: site): Array<Service> {
        return services()
            .filter(service => service.site.id === site.id)
    }

    function getSelectedServices(): Array<Service> {
        if (selectedSite) {
            return getSiteServices(selectedSite)
        }

        return []
    }

    function calculateMapHeight(): string | undefined {
        if (typeof window === "undefined" || !selectedSite) {
            return undefined;
        }

        /* calculate the height of the map */

        let mapHeight =
            window.innerHeight -
            ((document.querySelector(".AppBarContainer") as HTMLElement)?.offsetHeight || 0)

        /* resize the map to make room
            * for the selected results */
        mapHeight -= 150 * getSelectedServices().length

        /* limit minimum height to 1/2 of the screen real estate */
        mapHeight = Math.max(mapHeight,
            window.innerHeight / 2)

        return `${mapHeight}px`
    }

    const renderPage = () => (
        <div className="ResultsMapPage">
            <AppBar
                transition={false}
                onBackTouchTap={() => goToPersonalisationNextPath({
                    router,
                    map: false,
                })}
                backMessage="Back to results list"
            />
            <main aria-label="Map of search results">
                {renderPageBody()}
            </main>

        </div>
    )

    function renderPageBody() {
        if (searchIsLoading()) {
            return <div className="progress">
                <Loading className="big" />
            </div>
        } else {
            return <>
                <div
                    className="map"
                    style={{
                        flexBasis: calculateMapHeight() || "auto",
                        // On IE11 `display:contents` doesn't work so the map
                        // doesn't show. This is to set the height of the map
                        // if a service is selected it's 60vh otherwise 100vh
                        height: selectedSite ? "60vh" : "90vh",
                    }}
                >
                    <SitesMap
                        onSiteSelect={
                            site => {
                                // // Setting it null first will ensure
                                // // that the new travel times get loaded
                                // // When switching between sites without
                                // // closing the previous one
                                // this.setState({selectedSite: null}, () => {
                                //     this.setState({selectedSite: site})
                                // })
                                setSelectedSite(site)
                            }
                        }
                        sites={getSites()}
                        siteLocations={getSiteLocations()}
                        selectedSite={selectedSite}
                    />
                </div>
                <GeolocationButtonForTravelTimes
                    servicesToUpdateTravelTimes={getSelectedServices()}
                    onTravelTimesStatusChange={
                        travelTimesStatus => setTravelTimesStatus(travelTimesStatus)
                    }
                    showMessage={false}
                />
                <ResultsList
                    crisisResults={false}
                    travelTimesStatus={travelTimesStatus}
                    results={getSelectedServices()}
                    resultsLoading={searchIsLoading()}
                    sortBy={undefined}
                />
            </>
        }
    }

    if (searchType) {
        return renderPage()
    }

    return <NotFoundStaticPage/>

}

export default (withRouter(ResultsMapPage))