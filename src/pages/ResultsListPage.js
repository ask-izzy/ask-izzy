/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsPage from "./ResultsPage";
import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from
    "../components/ResultsListPage/LoadingResultsHeader";
import AlertBannerList from "../components/AlertBannerList";
import icons from "../icons";
import NotFoundStaticPage from "./NotFoundStaticPage"
import ButtonListItem from "../components/ButtonListItem";
import SuggestionBox from "./SuggestionBox";
import QuestionStepper from "./QuestionStepper";

import { stateFromLocation } from "../utils";
import ScreenReader from "../components/ScreenReader";
import SitesMap from "../components/SitesMap";
import type {Service, Site} from "../iss";
import GeolocationButton from "../components/GeolocationButton";
import storage from "../storage";

class ResultsListPage extends ResultsPage<> {
    render(): ReactElement<"div"> | ReactNode {
        if (this.state.searchType) {
            return this.renderPage()
        }

        return <NotFoundStaticPage/>
    }

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

    hasSearchResults(): boolean {
        return !this.state.searchResults ||
            this.state.searchResults.length === 0
    }

    onGeoLocationSuccess(params: {coords: Coordinates, name: string}): void {
        storage.setCoordinates(params.coords);
        this.setState({
            fetchedLocation: true,
        })
    }

    getSpecificLocationBanner(): ReactElement<"div"> {
        return <div className="specificLocationBanner">
            {!this.state?.fetchedLocation &&
            <div>
                Want estimated travel times?
            </div>
            }
            <GeolocationButton
                onSuccess={
                    this.onGeoLocationSuccess.bind(this)
                }
                restartSearch={
                    !this.state?.fetchedLocation
                }
            />
            {this.state?.fetchedLocation &&
            <button onClick={() => {
                storage.removeItem("coordinates")
                this.setState({
                    fetchedLocation: false,
                })
            }}
            >
                Clear
            </button>
            }
        </div>
    }

    renderPage: (() => ReactElement<"div">) = () => (
        <div className="ResultsListPage">
            <div
                role="complementary"
                aria-labelledby="header"
            >
                <ScreenReader>
                    <span id="header">
                        Header.
                    </span>
                </ScreenReader>
                <DebugContainer message="Debug personalisation">
                    <DebugPersonalisation
                        search={this.search}
                        items={this.personalisationComponents}
                    />
                </DebugContainer>
                <DebugContainer message="ISS Parameters">
                    <DebugSearch search={this.issParams()} />
                </DebugContainer>
                <LoadingResultsHeader
                    title={this.title}
                    category={this.category}
                    meta={this.state.searchMeta || {total_count: 0}}
                    personalisationComponents={this.personalisationComponents}
                    loading={this.searchIsLoading}
                    error={this.state.searchError ?
                        "An error occurred. Please try again."
                        : ""
                    }
                    statusCode={this.state.searchError?.status || 200}
                />
                <div className="List results">
                    <div tabIndex="0">
                        <QuestionStepper
                            category={this.category}
                            resultsPage={true}
                            results={this.state.searchResults || []}
                            location={this.context.router.location}
                        />
                    </div>
                </div>
            </div>
            {this.hasSearchResults() ||
                <AlertBannerList
                    state={stateFromLocation()}
                    screenLocation="resultsPage"
                    format="inline"
                />
            }
            <main aria-labelledby="searchResults">
                <ScreenReader>
                    <span id="searchResults">
                        Search Results.
                    </span>
                </ScreenReader>
                <div className="List results">
                    {this.hasSearchResults() ||
                        <div>
                            <SitesMap
                                sites={this.sites}
                                siteLocations={this.siteLocations}
                            />
                            {(!storage.getCoordinates() ||
                                this.state?.fetchedLocation) &&
                            this.getSpecificLocationBanner()
                            }
                        </div>
                    }
                    <ResultsList
                        results={this.state.searchResults || []}
                    />
                    {this.renderLoadMore()}
                    {this.renderSuggestionBox()}
                </div>
            </main>
        </div>
    )

    renderSuggestionBox(): void | ReactNode {
        if (
            !this.state.searchMeta?.next &&
            !this.searchIsLoading
        ) {
            return (
                <SuggestionBox
                    category={this.category}
                    searchTerm={this.title
                        .replace("“", "")
                        .replace("”", "")
                    }
                    location={this.context.router.location}
                    results={this.state.searchResults || []}
                />
            )
        }
    }

    renderLoadMore(): void | ReactElement<"div"> | ReactNode {
        if (this.state.searchMeta?.next) {
            return (
                <ButtonListItem
                    className="MoreResultsButton"
                    primaryText="Load more results…"
                    onClick={this.loadNextSearchPage}
                    analyticsEvent={{
                        event: "Action Triggered - Load More Results",
                        eventAction: "Load more results",
                        eventLabel: null,
                    }}
                />
            );
        }

        if (this.searchIsLoading) {
            return (
                <div className="progress">
                    <icons.Loading className="big" />
                </div>
            );
        }
    }

    get isDisabilityAdvocacy(): boolean {
        return this.search.q === "Disability Advocacy Providers"
    }
}

export default ResultsListPage;
