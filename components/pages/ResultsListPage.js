/* @flow */

import type {
    Node as ReactNode,
    Element as ReactElement,
    ElementConfig as ReactElementConfig,
} from "React";
import React from "react"
import { withRouter } from "next/router"
import type { NextRouter } from "next/router"

import DebugPersonalisation from "@/src/components/DebugPersonalisation";
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

import useServiceResults from "@/hooks/useServiceResults"

type Props = {
    router: NextRouter
}

function ResultsListPage({router}: Props): ReactNode {
    const {
        searchResults,
        pageTitle,
        category,
        searchIsLoading,
        searchError,
        travelTimesStatus,
        sortBy,
        searchType,
        setSortBy,
        setTravelTimesStatus,
        getIssSearchQuery,
        searchHasNextPage,
        loadNextSearchPage,
    } = useServiceResults(router)

    function hasSearchResults(): boolean {
        return Boolean(
            searchResults &&
                searchResults.length > 0
        )
    }

    const renderPage = (): ReactNode => (
        <div className="ResultsListPage">
            <div>
                <DebugPersonalisation
                    issQuery={getIssSearchQuery() || {}}
                    setIssParamsOverride={setIssParamsOverride}
                />
                <LoadingResultsHeader
                    title={pageTitle}
                    category={category}
                    services={searchResults || []}
                    loading={searchIsLoading()}
                    error={searchError ?
                        "An error occurred. Please try again."
                        : ""
                    }
                    statusCode={searchError?.status || 200}
                />
                {hasSearchResults() &&
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
                {renderResults()}
            </main>
        </div>
    )

    function renderResults(): ReactNode {
        return (
            <div className="List results">
                <ResultsList
                    results={searchResults || []}
                    resultsLoading={searchIsLoading()}
                    crisisResults={true}
                    travelTimesStatus={travelTimesStatus}
                    sortBy={undefined}
                />
                {hasSearchResults() &&
                    <Controls
                        onSortByChange={
                            sortBy => setSortBy(sortBy)
                        }
                        onTravelTimesStatusChange={
                            travelTimesStatus => setTravelTimesStatus(travelTimesStatus)
                        }
                        servicesToUpdateTravelTimes={
                            searchResults || []
                        }
                    />
                }
                <ResultsList
                    results={searchResults || []}
                    resultsLoading={searchIsLoading()}
                    crisisResults={false}
                    travelTimesStatus={travelTimesStatus}
                    sortBy={sortBy}
                />
                {renderLoadMore()}
                {renderSuggestionBox()}
                <ScrollToTop label="To top"/>
            </div>
        )
    }

    function renderSuggestionBox(): void | ReactNode {
        if (
            !searchHasNextPage() &&
            !searchIsLoading()
        ) {
            return (
                <SuggestionBox
                    category={category}
                    searchTerm={pageTitle
                        .replace("“", "")
                        .replace("”", "")
                    }
                    pathname={router.asPath}
                    results={searchResults || []}
                />
            )
        }
    }

    function renderLoadMore(): void | ReactElement<"div"> | ReactNode {
        if (searchHasNextPage() && !searchError) {
            return (
                <div className="moreResultsContainer">
                    <FlatButton
                        className="MoreResultsButton"
                        label="See more results"
                        onClick={loadNextSearchPage}
                        analyticsEvent={{
                            event: "Action Triggered - Load More Results",
                            eventAction: "Load more results",
                            eventLabel: null,
                        }}
                    />
                </div>
            );
        }

        if (searchIsLoading()) {
            return (
                <div className="progress">
                    <icons.Loading className="big" />
                </div>
            );
        }
    }

    function setIssParamsOverride(
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
        }
    }

    if (searchType) {
        return (
            <div>
                {renderPage()}
            </div>
        )
    }

    return <NotFoundStaticPage/>
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
