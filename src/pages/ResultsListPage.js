/* @flow */

import React from "react";
import PropTypes from "proptypes";
import _ from "underscore";

import AppBar from "../components/AppBar";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsPage from "./ResultsPage";
import ResultsList from "../components/ResultsList";
import HeaderBar from "../components/HeaderBar";
import LimitedServicesBanner from "../components/LimitedServicesBanner";
import ViewOnMapButton from "../components/ViewOnMapButton";
import icons from "../icons";
import routerContext from "../contexts/router-context";

import * as gtm from "../google-tag-manager";
import storage from "../storage";
import type { Service } from "../iss";
import type Category from "../constants/Category";


type primaryInfo = {
    title: string,
    subtitle: string,
    body: string,
    learnMoreText: ?string,
    learnMoreLink: string,
}

type Props = {
    loadMore: any,
    objects: Array<Service>,
    location: any,
    personalisationComponents: Array<Object>,
    title: string,
    statusCode: number,
    meta: {total_count: number},
    loading: boolean,
    error: string,
    category?: Category,
    search?: {search: string},
}

type State = {
    primaryInfo: ?primaryInfo,
    keyInfo: ?Array<Object>
}

class ResultsListPage extends ResultsPage<Props, State> {
    constructor(props: Object, context: Object) {
        super(props, context);

        const topicInfo = this.category && getTopicInfo(this.category.slug)

        this.state = {
            ...this.state,
            primaryInfo: topicInfo && topicInfo.primaryInfo,
            keyInfo: topicInfo && topicInfo.keyInfo,
        };
    }

    recordMapClick(): void {
        if (this.props.search) {
            gtm.emit({
                event: "ViewOnMap",
                search: this.props.search,
                location: storage.getLocation(),
            });
        } else if (this.props.category) {
            gtm.emit({
                event: "ViewOnMap",
                category: this.props.category,
                location: storage.getLocation(),
            });
        }

    }

    render() {
        const path = this.props.location.pathname.replace(/\/?$/, "/map");

        return (
            <div className="ResultsListPage">
                <AppBar
                    title={this.title}
                    backMessage={this.backButtonMessage()}
                    onBackTouchTap={this.context.router.history.goBack}
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
                                {this.state.primaryInfo && <li><a href="#tools">
                                    <icons.DownArrow />{this.state.primaryInfo.title}
                                </a></li>}
                                {this.state.keyInfo && <li><a href="#information">
                                    <icons.DownArrow />Key information
                                </a></li>}
                                <li><a href="#services">
                                    <icons.DownArrow />Support services
                                </a></li>
                            </ul>
                        </div>
                    }
                    bannerName={this.category && this.category.bannerImage ? this.category.bannerImage : "homepage"}
                />

                { this.renderPrimaryInfo() }

                { this.renderKeyInfo() }

                <a className="anchor"
                    id="services"
                />
                <div className="supportServices">
                    <div className="heading">
                        <h3>Support services</h3>
                        <hr />
                        <ViewOnMapButton
                            to={this.props.location.pathname.replace(/\/?$/, "/map")}
                            onClick={this.recordMapClick.bind(this)}
                        />
                    </div>

                    <ResultsList
                        results={this.state.searchResults}
                    />
                    {this.renderLoadMore()}
                </div>
            </div>
        );
    }

    renderPrimaryInfo() {
        const primaryInfo = this.state.primaryInfo
        if (!primaryInfo) {
            return null
        }
        return (
            <React.Fragment>
                <a className="anchor"
                    id="tools"
                />
                <div className="primaryInfo">
                    <a
                        className="title"
                        href={primaryInfo.learnMoreLink}
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        <h3>{primaryInfo.title}</h3>
                    </a>
                    <h4>{primaryInfo.subtitle}</h4>
                    <div className="body">{primaryInfo.body}</div>
                    <a
                        className="learnMore"
                        href={primaryInfo.learnMoreLink}
                        rel="noopener noreferer"
                        target="_blank"
                    >
                        {primaryInfo.learnMoreText || "Learn More"}
                    </a>
                </div>
            </React.Fragment>
        )
    }

    renderKeyInfo() {
        const keyInfo = this.state.keyInfo
        if (!keyInfo) {
            return null
        }
        return (
            <React.Fragment>
                <a className="anchor"
                    id="information"
                />
                <div className="keyInfos">
                    <h3>Key Information</h3>
                    {keyInfo.map(info =>
                        <div className="keyInfo"
                            key={info.title}
                        >
                            <a
                                className="title"
                                href={info.learnMoreLink}
                                rel="noopener noreferer"
                                target="_blank"
                            >
                                <h3>{info.title}</h3>
                            </a>
                            <h4>{info.subtitle}</h4>
                            <div className="body">{info.body}</div>
                            <a
                                className="learnMore"
                                href={info.learnMoreLink}
                                rel="noopener noreferer"
                                target="_blank"
                            >
                                {info.learnMoreText || "Learn More"}
                            </a>
                        </div>
                    )}
                </div>
            </React.Fragment>
        )
    }

    renderLoadMore() {
        if (this.state.searchResultsMeta && this.state.searchResultsMeta.next) {
            return (
                <div className="loadMore">
                    <button
                        onClick={this.loadMore.bind(this)}
                    >
                        Load more results…
                    </button>
                </div>
            );
        }

        if (this.loading) {
            return (
                <div className="progress">
                    <icons.Loading className="big" />
                </div>
            );
        }
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

