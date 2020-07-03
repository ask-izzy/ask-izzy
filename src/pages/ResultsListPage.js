/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsPage from "./ResultsPage";
import ResultsList from "../components/ResultsList";
import CrisisResultsList from "../components/CrisisResultsList";
import HeaderBar from "../components/HeaderBar";
import Switch from "../components/Switch";
import AlertBannerList from "../components/AlertBannerList";
import ViewOnMapButton from "../components/ViewOnMapButton";
import icons from "../icons";
import NotFoundStaticPage from "./NotFoundStaticPage"
import ContentList from "../components/content/ContentList";
import SuggestionBox from "./SuggestionBox";
import QuestionStepper from "./QuestionStepper";
import Button from "../components/base/Button";
import Link from "../components/base/Link";
import UserSnapResults from "../components/feedback/UserSnapResults";

import Query from "../queries/query";
import externalResourcesQuery from "../queries/content/externalResources.js";

import { stateFromLocation } from "../utils";
import ScreenReader from "../components/ScreenReader";


class ResultsListPage extends ResultsPage {
    render(): ReactElement<"div"> | ReactNode {
        if (this.state.searchType) {
            return this.renderPage()
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
                <DebugContainer message="ISS Parameters">
                    <DebugSearch search={this.issParams()} />
                </DebugContainer>
                <HeaderBar
                    className="LoadingResultsHeader"
                    primaryText={
                        <div className="LogoHeader">
                            {this.title}
                        </div>
                    }
                    secondaryText={
                        <div>
                            What you'll find here:
                            <ul>
                                <li><Link to="#tools">
                                    <icons.DownArrow />Highlighted resource
                                </Link></li>
                                <li><Link to="#information">
                                    <icons.DownArrow />Key information
                                </Link></li>
                                <li><Link to="#services">
                                    <icons.DownArrow />Support services
                                </Link></li>
                            </ul>
                        </div>
                    }
                    bannerName={this.category?.bannerImage || "homepage"}
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
                { this.renderCrisisLines() }

                { this.renderPrimaryInfo() }

                { this.renderKeyInfo() }

                { this.renderSupportServices() }
            </main>
        </div>
    )

    renderPrimaryInfo(): ReactNode {
        return (
            <React.Fragment>
                <span
                    className="anchor"
                    id="tools"
                />
                <div className="primaryInfo">
                    <Query
                        query={externalResourcesQuery}
                        category={[this.category?.title]}
                        tag={["Tool", "Covid19"]}
                    >
                        {data => (
                            <ContentList
                                items={data.data.externalResources}
                            />
                        )}
                    </Query>
                </div>
            </React.Fragment>
        )
    }

    renderKeyInfo(): ReactNode {
        return (
            <React.Fragment>
                <span
                    className="anchor"
                    id="information"
                />
                <div className="keyInfos">
                    <h3>Key information</h3>
                    <Query
                        query={externalResourcesQuery}
                        category={[this.category?.title]}
                        tag={["Information", "Covid19"]}
                    >
                        {data => (
                            <ContentList
                                className="featured"
                                items={data.data.externalResources}
                            />
                        )}
                    </Query>
                </div>
            </React.Fragment>
        )
    }

    renderSupportServices: () => ReactNode = () => <>
        <span
            className="anchor"
            id="services"
        />
        <div className="supportServices">
            <div className="heading">
                <h3>Support services</h3>
                <hr />
                {this.hasSearchResults() ||
                    <ViewOnMapButton
                        to={this.context.router.location
                            .pathname.replace(/\/?$/, "/map")
                        }
                    />
                }
            </div>
            <Switch>
                <div
                    switch-if={
                        !this.state.searchError &&
                        this.state.searchResults?.length === 0
                    }
                    className="resultsStatus"
                >
                    Sorry, I couldn't find any results
                    for <em>{this.title}</em>.
                </div>
                <ResultsList
                    switch-if={this.state.searchResults}
                    results={this.state.searchResults || []}
                />
            </Switch>
            <Switch>
                <div switch-if={this.state.searchError}
                    className="resultsStatus"
                >
                    Sorry, an error occurred. Please try again.
                </div>
            </Switch>
            <Switch>
                <div
                    switch-if={this.searchIsLoading}
                    className="resultsStatus"
                >
                    <icons.Loading className="big" />
                </div>

                <div switch-if={this.searchHasNextPage}
                    className="loadMore"
                >
                    <Button
                        onClick={this.loadNextSearchPage}
                        analyticsEvent={{
                            event: "Action Triggered - " +
                                "Load More Results",
                            eventAction: "Load more results",
                            eventLabel: null,
                        }}
                    >
                        Load more results…
                    </Button>
                </div>
            </Switch>
            {this.renderFeedbackCantFind()}
            { this.renderSuggestionBox() }
        </div>
    </>

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

    renderCrisisLines: () => ReactNode = () => <>
        <a className="anchor"
            id="crisis-lines"
        />
        <div className={this.crisisResults?.length ? "crisisLines" : ""}>
            <Switch>
                <div
                    switch-if={this.searchIsLoading}
                    className="resultsStatus"
                >
                    <icons.Loading className="big" />
                </div>
                <CrisisResultsList
                    switch-if={this.crisisResults?.length}
                    results={this.crisisResults || []}
                />
            </Switch>
        </div>
    </>

    renderFeedbackCantFind(): ReactNode | void {
        if (!this.searchIsLoading && this.state.searchPagesLoaded > 2) {
            return <UserSnapResults />
        }
    }

    get isDisabilityAdvocacy(): boolean {
        return this.search.q === "Disability Advocacy Providers"
    }
}

export default ResultsListPage;
