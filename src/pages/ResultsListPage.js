/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsPage from "./ResultsPage";
import ResultsList from "../components/ResultsList";
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

import { stateFromLocation } from "../utils";
import ScreenReader from "../components/ScreenReader";

type primaryInfo = {
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
    constructor(props: Object, context: Object) {
        super(props, context);

        const topicInfo = this.category && getTopicInfo(this.category.slug)

        this.state = {
            ...this.state,
            primaryInfo: topicInfo && topicInfo.primaryInfo,
            keyInfo: topicInfo && topicInfo.keyInfo,
        };
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
function getTopicInfo(categorySlug) {
    if (categorySlug === "rent-and-tenancy") {
        return {
            primaryInfo: {
                title: "Dear Landlord Letter Writer",
                subtitle: "By Justice Connect",
                body: "Dear Landlord can help you if you are struggling " +
                    "to pay rent. Answer a few questions and Dear " +
                    "Landlord will help determine the best way forward, " +
                    "whether that’s helping you draft a rent reduction " +
                    "letter to your landlord, contacting Consumer " +
                    "Affairs Victoria to help negotiate a rent " +
                    "reduction, tips for mediation, or for appearing at " +
                    "VCAT.",
                learnMoreText: "Take me to Dear Landlord",
                learnMoreLink: "https://justiceconnect.org.au/resources" +
                    "/dear-landlord-letter-writer/",
            },
            keyInfo: [
                {
                    title: "Rent relief grants",
                    subtitle: "Housing.vic",
                    body:
                        "The Victorian Government has recently announced " +
                        "rent relief grants for Victorians experiencing " +
                        "rental hardship as a result of the coronavirus " +
                        "(COVID-19) crisis.",
                    learnMoreLink: "https://rentrelief.covid19.dhhs.vic." +
                        "gov.au/",
                },
                {
                    title: "Know your rights",
                    subtitle: "Consumer Affairs",
                    body:
                        "Here you’ll find out about rights and " +
                        "responsibilities in areas Consumer Affairs is " +
                        "receiving increased enquiries about, including " +
                        "housing, and products and services.",
                    learnMoreLink:
                        "https://www.consumer.vic.gov.au/resources-and-" +
                        "tools/advice-in-a-disaster/coronavirus-covid19" +
                        "-and-your-rights",
                },
            ],
        };
    } else if (categorySlug === "money") {
        return {
            primaryInfo: {
                title: "Free calculators, tips and guidance",
                subtitle: "By moneysmart.gov.au",
                body: "moneysmart helps Australians take control of " +
                    "their money and build a better  life with free " +
                    "tools, tips and guidance:",
                learnMoreText: "Learn more at moneysmart",
                learnMoreLink: "https://moneysmart.gov.au/",
            },
            keyInfo: [
                {
                    title: "Free financial counsellors service",
                    subtitle: "National Debt Helpline",
                    body:
                        "National Debt Helpline is a not-for-profit " +
                        "service that helps people tackle their debt " +
                        "problems. Their professional financial " +
                        "counsellors offer a free, independent and " +
                        "confidential service.",
                    learnMoreLink: "https://ndh.org.au/",
                },
                {
                    title: "How to get help from your bank",
                    subtitle: "Australian Banking Association",
                    body: "Here you'll find out about the major changes " +
                        "banks have introduced to help customers " +
                        "through this difficult time.",
                    learnMoreLink: "https://www.ausbanking.org.au/" +
                        "covid-19/",
                },
            ],
        };
    } else if (categorySlug === "accommodation") {
        return {
            primaryInfo: {
                title: "Emergency Housing Support",
                subtitle: "Victorian Statewide Homelessness Line",
                body: "1800 825 955 will connect you with someone who can" +
                    "assess your needs. This call may not be free from " +
                    "mobiles. If you are ringing from a mobile you can " +
                    "ask to be called back.",
                learnMoreText: "call the hotline",
                learnMoreLink: "tel:1800825955",
            },
            keyInfo: [
                {
                    title: "Housing crisis support",
                    subtitle: "Launch Housing",
                    body:
                        "Launch Housing offers Melbournians emergency " +
                        "shelter, crisis accommodation, specialist " +
                        "supports, and rough sleeping services so those " +
                        "at risk can secure a safe home.",
                    learnMoreLink: "https://www.launchhousing.org.au/" +
                        "homelessness-services",
                },
                {
                    title: "Cohealth homeless support services",
                    subtitle: "cohealth",
                    body: "Knowing what services are available to you " +
                        "when you're homeless or at risk of being " +
                        "homeless is not always easy. Cohealth can help " +
                        "you get the support you need on a short or " +
                        "medium term basis to access housing.",
                    learnMoreLink: "https://www.cohealth.org.au/" +
                        "health-services/homelessness-support/",
                },
            ],
        };
    } else if (categorySlug === "food-and-everyday-things") {
        return {
            primaryInfo: {
                title: "Types of Food Support",
                subtitle: "Ask Izzy",
                body: "If you're having trouble feeding yourself or " +
                    "your family, help is available. This page describes " +
                    "some of the common types of food support, and tells " +
                    "you where you can find them.",
                learnMoreText: "Read more",
                learnMoreLink: "www.beta.askyizzy.org.au/food",
            },
            keyInfo: [
                {
                    title: "Community food relief directory",
                    subtitle: "Study Melbourne",
                    body:
                        "Study Melbourne has collected a list of food and" +
                        " other community supports across Victoria, " +
                        "including services for those on Student or other" +
                        " categories of Visa",
                    learnMoreLink: "https://www.studymelbourne.vic.gov.au" +
                        "/news-updates/updates/support-and-food-relief-" +
                        "organisations",
                },
                {
                    title: "Community Food Guide",
                    subtitle: "City of Melbourne",
                    body:
                        "Supporting people in the City of Melbourne to " +
                        "access, grow and use healthy food (PDF).",
                    learnMoreLink:
                        "https://www.melbourne.vic.gov.au/" +
                        "SiteCollectionDocuments/community-food-guide.pdf",
                },
            ],
        };
    } else if (categorySlug === "mental-health") {
        return {
            primaryInfo: {
                title: "Mental health and wellbeing support",
                subtitle: "Lifeline",
                body:
                "It is important that you seek help if you feel you need " +
                "it. Lifeline is here to offer support to you and listen " +
                "on 13 11 14, or click below to learn more",
                learnMoreText: "Learn more at Lifeline.org.au",
                learnMoreLink: "https://www.lifeline.org.au",
            },
            keyInfo: [
                {
                    title: "Managing daily life during the panedmic",
                    subtitle: "Beyond Blue",
                    body:
                        "Beyond Blue has a collection of resources to " +
                        "help you manage your mental health during " +
                        "and after the pandemic",
                    learnMoreLink:
                        "https://coronavirus.beyondblue.org.au/managing" +
                        "-my-daily-life.html",
                },
                {
                    title: "Online support for anxiety and depression",
                    subtitle: "Mindspot",
                    body:
                        "MindSpot has a number of tools, and fact sheets " +
                        "to help people struggling with poor mental " +
                        "health, including a free telephone counselling " +
                        "service.",
                    learnMoreLink: "https://mindspot.org.au/coronavirus",
                },
            ],
        };
    } else {
        return {
            primaryInfo: undefined,
            keyInfo: undefined,
        };
    }
}
