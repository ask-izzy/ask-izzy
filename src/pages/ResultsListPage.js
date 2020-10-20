/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsPage from "./ResultsPage";
import ResultsList from "../components/ResultsList";
import resultsContent from "../results-content.json"
import HeaderBar from "../components/HeaderBar";
import Switch from "../components/Switch";
import AlertBannerList from "../components/AlertBannerList";
import ViewOnMapButton from "../components/ViewOnMapButton";
import icons from "../icons";
import NotFoundStaticPage from "./NotFoundStaticPage"
import SuggestionBox from "./SuggestionBox";
import QuestionStepper from "./QuestionStepper";
import Button from "../components/base/Button";
import Link from "../components/base/Link";
import Category from "../constants/Category";

import { stateFromLocation } from "../utils";
import ScreenReader from "../components/ScreenReader";
import storage from "../storage";

type primaryInfo = {
    name: String,
    title: string,
    subtitle: string,
    body: string,
    learnMoreText: ?string,
    learnMoreLink: string,
}

type State = {
    primaryInfo: ?primaryInfo,
    keyInfo: ?Array<Object>
}

class ResultsListPage extends ResultsPage<{}, State> {
    componentDidMount() {
        super.componentDidMount();

        // We have to load this after the first render so we match
        // server-rendered markup on hydrate stage
        const category = this.category
        if (category) {
            const subCategory = category.slug === "money" ?
                ((storage.getItem("sub-money"): any): ?string)
                : ""
            const topicInfo = getTopicInfo(
                category,
                subCategory,
                storage.getLocation()
            )
            this.setState({
                primaryInfo: topicInfo && topicInfo.primaryInfo,
                keyInfo: topicInfo && topicInfo.keyInfo,
            })
        }
    }
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
                                {this.state.primaryInfo && <li>
                                    <Link to="#tools">
                                        <icons.DownArrow />
                                        {this.state.primaryInfo.title}
                                    </Link>
                                </li>}
                                {this.state.keyInfo && <li>
                                    <Link to="#information">
                                        <icons.DownArrow />Key information
                                    </Link>
                                </li>}
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

                { this.renderPrimaryInfo() }

                { this.renderKeyInfo() }

                { this.renderSupportServices() }
            </main>
        </div>
    )

    renderPrimaryInfo(): ReactNode {
        const primaryInfo = this.state.primaryInfo
        if (!primaryInfo) {
            return null
        }
        return (
            <React.Fragment>
                <span
                    className="anchor"
                    id="tools"
                />
                <div className="primaryInfo">
                    <Link
                        className="title"
                        to={primaryInfo.learnMoreLink}
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        <h3>{primaryInfo.title}</h3>
                    </Link>
                    <h4>{primaryInfo.subtitle}</h4>
                    <div className="body">{primaryInfo.body}</div>
                    <Link
                        className="learnMore"
                        to={primaryInfo.learnMoreLink}
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        {primaryInfo.learnMoreText || "Learn More"}
                    </Link>
                </div>
            </React.Fragment>
        )
    }

    renderKeyInfo(): ReactNode {
        const keyInfo = this.state.keyInfo
        if (!keyInfo) {
            return null
        }
        return (
            <React.Fragment>
                <span
                    className="anchor"
                    id="information"
                />
                <div className="keyInfos">
                    <h3>Key information</h3>
                    {keyInfo.map(info =>
                        <div className="keyInfo"
                            key={info.title}
                        >
                            <Link
                                className="title"
                                to={info.learnMoreLink}
                                rel="noopener noreferer"
                                target="_blank"
                            >
                                <h3>{info.title}</h3>
                            </Link>
                            <h4>{info.subtitle}</h4>
                            <div className="body">{info.body}</div>
                            <Link
                                className="learnMore"
                                to={info.learnMoreLink}
                                rel="noopener noreferer"
                                target="_blank"
                            >
                                {info.learnMoreText || "Learn More"}
                            </Link>
                        </div>
                    )}
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

    get isDisabilityAdvocacy(): boolean {
        return this.search.q === "Disability Advocacy Providers"
    }
}

export default ResultsListPage;

// Soon to be pulled from the CMS
function getTopicInfo(
    category: Category,
    subCategory: ?string,
    location: string
) {
    let resultsCategoryKey;
    const slugMap = {
        "rent-and-tenancy": "Rent and Tenancy Help",
        "money": "Money Help",
        "food-and-everyday-things": "Food & Everyday things",
        "mental-health": "Mental health & Wellbeing",
        "jobs-and-training": "Jobs, Skills, and Training",
        "accommodation": "Housing",
    }
    resultsCategoryKey = slugMap[category.slug]
    if (category.slug === "money" && subCategory === "Centrelink") {
        resultsCategoryKey = "Centrelink"
    }
    const locationMatch = location.match(/,\s*(\w+)$/)
    const resultsStateKey = locationMatch && locationMatch[1]

    const relevantResultsContent = resultsContent
        .filter(
            content => content.Category === resultsCategoryKey &&
                (
                    content.State.length === 0 ||
                    content.State.some(state => state === resultsStateKey)
                ) &&
                content.Status !== "Potential"
        )
        .map(content => ({
            name: content.Name,
            title: content["Display Title"],
            subtitle: content.Subtitle,
            body: content["Body text"],
            learnMoreText: content["Link text"],
            learnMoreLink: content["Link URL"],
            type: content.Type,
            original: content,
        }))
    const primaryInfo = relevantResultsContent
        .filter(content => content.type === "Primary Info").shift();
    const keyInfo = relevantResultsContent
        .filter(content => content.type === "Secondary Info");

    return {
        primaryInfo,
        keyInfo: keyInfo.length ? keyInfo : undefined,
    }
}
