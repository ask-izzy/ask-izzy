/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import AppBar from "../components/AppBar";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsPage from "./ResultsPage";
import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from
    "../components/ResultsListPage/LoadingResultsHeader";
import AlertBannerList from "../components/AlertBannerList";
import ViewOnMapButton from "../components/ViewOnMapButton";
import icons from "../icons";
import NotFoundStaticPage from "./NotFoundStaticPage"
import ButtonListItem from "../components/ButtonListItem";
import SuggestionBox from "./SuggestionBox";
import QuestionStepper from "./QuestionStepper";

import { stateFromLocation } from "../utils";
import ScreenReader from "../components/ScreenReader";

class ResultsListPage extends ResultsPage<> {
    render(): ReactElement<"div"> | ReactNode {
        if (this.state.searchType) {
            return this.renderPage()
        }

        return <NotFoundStaticPage/>
    }

    renderPage: (() => ReactElement<"div">) = () => (
        <div className="ResultsListPage">
            <AppBar
                backMessage={this.isDisabilityAdvocacy ? "" : "Categories"}
                onBackTouchTap={() => this.context.router.navigate(
                    this.isDisabilityAdvocacy ?
                        "/disability-advocacy-finder"
                        : "/"
                )}
            />
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
            <main aria-labelledby="searchResults">
                <ScreenReader>
                    <span id="searchResults">
                        Search Results.
                    </span>
                </ScreenReader>
                <div className="List results">
                    {
                        !this.state.searchResults ||
                        this.state.searchResults.length === 0 ||
                        <>
                            <AlertBannerList
                                state={stateFromLocation()}
                                screenLocation="resultsPage"
                                format="inline"
                            />
                            <ViewOnMapButton
                                to={this.context.router.location
                                    .pathname.replace(/\/?$/, "/map")
                                }
                            />
                        </>
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
