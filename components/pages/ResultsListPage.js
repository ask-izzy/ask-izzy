/* @flow */

import type {
    Node as ReactNode,
    Element as ReactElement,
    ElementConfig as ReactElementConfig,
} from "React";
import React from "react";
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import DebugPersonalisation from "@/src/components/DebugPersonalisation";
import ResultsPage from "@/components/pages/ResultsPage";
import ResultsList from "@/src/components/ResultsList";
import LoadingResultsHeader from
"@/src/components/ResultsListPage/LoadingResultsHeader";
import AlertBannerList from "@/src/components/AlertBannerList";
import icons from "@/src/icons";
import NotFoundStaticPage from "@/pages/404"
import FlatButton from "@/src/components/FlatButton";
import SuggestionBox from "@/components/SuggestionBox";
import QuestionStepper from "@/src/components/QuestionStepper";
import { stateFromLocation } from "@/src/utils";
import ScrollToTop from "@/src/components/ResultsListPage/ScrollToTop";
import Storage from "@/src/storage";
import Controls from "@/src/components/ResultsListPage/Controls";

type Props = {
    router: NextRouter
}

class ResultsListPage extends ResultsPage<Props> {
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
            <div>
                <DebugPersonalisation
                    issQuery={this.getIssSearchQuery() || {}}
                    setIssParamsOverride={this.setIssParamsOverride.bind(this)}
                />
                <LoadingResultsHeader
                    title={this.state.pageTitle}
                    category={this.state.category}
                    services={this.state.searchResults || []}
                    loading={this.searchIsLoading}
                    error={this.state.searchError ?
                        "An error occurred. Please try again."
                        : ""
                    }
                    statusCode={this.state.searchError?.status || 200}
                />
                {this.hasSearchResults() &&
                <AlertBannerList
                    state={stateFromLocation()}
                    screenLocation="resultsPage"
                    format="inline"
                />
                }
                <QuestionStepper
                    showEditAnswers={true}
                    hideStepInfo={true}
                />
            </div>
            <main aria-label="Search results">
                {this.renderResults()}
            </main>
        </div>
    )

    renderResults(): ReactNode {
        return (
            <div className="List results">
                <ResultsList
                    results={this.state.searchResults || []}
                    resultsLoading={this.searchIsLoading}
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
                    resultsLoading={this.searchIsLoading}
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
            !this.searchHasNextPage &&
            !this.searchIsLoading
        ) {
            return (
                <SuggestionBox
                    category={this.state.category}
                    searchTerm={this.state.pageTitle
                        .replace("“", "")
                        .replace("”", "")
                    }
                    pathname={this.props.router.asPath}
                    results={this.state.searchResults || []}
                />
            )
        }
    }

    renderLoadMore(): void | ReactElement<"div"> | ReactNode {
        if (this.searchHasNextPage && !this.state.searchError) {
            return (
                <div className="moreResultsContainer">
                    <FlatButton
                        className="MoreResultsButton"
                        label="See more results"
                        onClick={this.loadNextSearchPage.bind(this)}
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

export default (
    withRouter(ResultsListPage):
        Class<
            React$Component<
                $Diff<
                    ReactElementConfig<typeof ResultsListPage>,
                    {router: *}
                >
            >
        >
)
