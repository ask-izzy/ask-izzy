/* @flow */

import type {Node, Element} from "React";
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

class ResultsListPage extends ResultsPage<> {
    render(): Element<"div"> | Node {
        if (this.state.searchType) {
            return this.renderPage()
        }

        return <NotFoundStaticPage/>
    }

    renderPage: (() => Element<"div">) = () => (
        <div className="ResultsListPage">
            <AppBar
                backMessage={this.isDisabilityAdvocacy ? "" : "Categories"}
                onBackTouchTap={() => this.context.router.navigate(
                    this.isDisabilityAdvocacy ?
                        "/disability-advocacy-finder"
                        : "/"
                )}
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
                <div>
                    <QuestionStepper
                        category={this.category}
                        resultsPage={true}
                        results={this.state.searchResults || []}
                        location={this.context.router.location}
                    />
                </div>
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
        </div>
    )

    renderSuggestionBox(): void | Node {
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

    renderLoadMore(): void | Element<"div"> | Node {
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
