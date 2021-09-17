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
import storage from "../storage";

import { stateFromLocation } from "../utils";
import ScreenReader from "../components/ScreenReader";
import ResultsPageGeolocationButton from "./ResultsPageGeolocationButton";
import IssParamsOverrideControls from
    "../components/debug/IssParamsOverrideControls";
import Controls from "../components/ResultsListPage/Controls";

class ResultsListPage extends ResultsPage<> {
    render(): ReactElement<"div"> | ReactNode {
        if (this.state.searchType) {
            return (
                <div onClick={(event) => {
                    if (typeof event.target.className === "string" &&
                        !event.target.className.includes("optionSelect")) {
                        this.setState((prevState) => (
                            {
                                hideOptions: !prevState.hideOptions,
                            })
                        )
                    }
                }}
                >
                    {this.renderPage()}
                </div>
            )
        }

        return <NotFoundStaticPage/>
    }

    hasSearchResults(): boolean {
        return !this.state.searchResults ||
            this.state.searchResults.length === 0
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
                <DebugContainer
                    message="ISS Parameters"
                    initiallyExpanded={!!storage.getJSON("issParamsOverride")}
                >
                    {storage.getJSON("issParamsOverride") ?
                        <IssParamsOverrideControls
                            originalIssParams={this.issParams() || {}}
                            issParamsOverride={
                                storage.getJSON("issParamsOverride")
                            }
                            setIssParamsOverride={
                                this.setIssParamsOverride.bind(this)
                            }
                        />
                        : <>
                            <DebugSearch search={this.issParams()} />
                            <button
                                onClick={() => this.setIssParamsOverride(
                                    this.issParams() || {},
                                    false
                                )}
                            >
                                Override ISS Params
                            </button>
                        </>
                    }

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
                            <Controls
                                category={this.category}
                                orderByCallback={(sortOption) => {
                                    this.setState({sortOption})
                                }}
                            />
                            <ResultsPageGeolocationButton
                                fetchedLocation={this.state.fetchedLocation}
                                onGeoLocationSuccess={
                                    this.onGeoLocationSuccess.bind(this)
                                }
                                onfetchNewLocation={(fetchedLocationStatus) => {
                                    this.setState({
                                        fetchedLocation: fetchedLocationStatus,
                                    })
                                }}
                            />
                        </div>
                    }
                    <ResultsList
                        reFetchTravelTimes={this.state?.fetchedLocation}
                        sortOption={this.state.sortOption}
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

    setIssParamsOverride(
        issParamsOverride?: { [string]: any },
        triggerNewSearch: boolean = true
    ): void {
        if (issParamsOverride) {
            storage.setJSON("issParamsOverride", issParamsOverride)
        } else {
            storage.removeItem("issParamsOverride")
        }
        if (triggerNewSearch) {
            location.reload();
        } else {
            this.forceUpdate()
        }
    }
}


export default ResultsListPage;
