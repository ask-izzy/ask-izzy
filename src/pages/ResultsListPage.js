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
import FlatButton from "../components/FlatButton";
import SuggestionBox from "./SuggestionBox";
import QuestionStepper from "./QuestionStepper";
import {getInitialSearchRequest} from "../iss/serviceSearch";
import { stateFromLocation } from "../utils";
import ScreenReader from "../components/ScreenReader";
import IssParamsOverrideControls from
    "../components/debug/IssParamsOverrideControls";
import ScrollToTop from "../components/ResultsListPage/ScrollToTop";
import Storage from "../storage";
import Controls from "../components/ResultsListPage/Controls";
import {
    getPersonalisationPages,
} from "../utils/personalisation"

class ResultsListPage extends ResultsPage<> {
    render(): ReactElement<"div"> | ReactNode {
        if (this.state.searchType) {
            return (
                <div>
                    {this.renderPage()}
                </div>
            )
        }

        return <NotFoundStaticPage/>
    }

    hasSearchResults(): boolean {
        return Boolean(
            this.state.searchResults &&
                this.state.searchResults.length > 0
        )
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
                        search={getInitialSearchRequest(
                            this.context.router
                        )}
                        items={getPersonalisationPages(
                            this.context.router
                        )}
                    />
                </DebugContainer>
                <DebugContainer
                    message="ISS Parameters"
                    initiallyExpanded={!!Storage.getJSON("issParamsOverride")}
                >
                    {Storage.getJSON("issParamsOverride") ?
                        <IssParamsOverrideControls
                            originalIssParams={this.issParams() || {}}
                            issParamsOverride={
                                Storage.getJSON("issParamsOverride")
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
                    title={this.state.pageTitle}
                    category={this.state.category}
                    meta={this.state.searchMeta || {total_count: 0}}
                    loading={this.searchIsLoading}
                    error={this.state.searchError ?
                        "An error occurred. Please try again."
                        : ""
                    }
                    statusCode={this.state.searchError?.status || 200}
                />
                <QuestionStepper
                    category={this.state.category}
                    showEditAnswers={true}
                />
            </div>
            {this.hasSearchResults() &&
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
                {this.renderResults()}
            </main>
        </div>
    )

    renderResults(): ReactNode {
        return (
            <div className="List results">
                <ResultsList
                    results={this.state.searchResults || []}
                    crisisResults={true}
                    travelTimesStatus={this.state.travelTimesStatus}
                    sortBy={undefined}
                />
                {this.hasSearchResults() &&
                    <Controls
                        onSortByChange={
                            sortBy => this.setState({sortBy})
                        }
                        onTravelTimesStatusChange={
                            travelTimesStatus => this.setState({
                                travelTimesStatus,
                            })
                        }
                        servicesToUpdateTravelTimes={
                            this.state.searchResults || []
                        }
                    />
                }
                <ResultsList
                    results={this.state.searchResults || []}
                    crisisResults={false}
                    travelTimesStatus={this.state.travelTimesStatus}
                    sortBy={this.state.sortBy}
                />
                {this.renderLoadMore()}
                {this.renderSuggestionBox()}
                <ScrollToTop label="To top"/>
            </div>
        )
    }

    renderSuggestionBox(): void | ReactNode {
        if (
            !this.state.searchMeta?.next &&
            !this.searchIsLoading
        ) {
            return (
                <SuggestionBox
                    category={this.state.category}
                    searchTerm={this.state.pageTitle
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
                <div className="moreResultsContainer">
                    <FlatButton
                        className="MoreResultsButton"
                        label="See more results"
                        onClick={this.loadNextSearchPage}
                        analyticsEvent={{
                            event: "Action Triggered - Load More Results",
                            eventAction: "Load more results",
                            eventLabel: null,
                        }}
                    />
                </div>
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

    setIssParamsOverride(
        issParamsOverride?: { [string]: any },
        triggerNewSearch: boolean = true
    ): void {
        if (issParamsOverride) {
            Storage.setJSON("issParamsOverride", issParamsOverride)
        } else {
            Storage.removeItem("issParamsOverride")
        }
        if (triggerNewSearch) {
            location.reload();
        } else {
            this.forceUpdate()
        }
    }
}


export default ResultsListPage;
