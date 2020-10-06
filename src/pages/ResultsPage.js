/* @flow */

import * as React from "react";
import {Link} from "react-router-dom";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import icons from "../icons";
import storage from "../storage";
import * as gtm from "../google-tag-manager";

import AppBar from "../components/AppBar";
import ResultsMap from "../components/ResultsMap";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import HeaderBar from "../components/HeaderBar";
import LinkListItem from "../components/LinkListItem";
import ResultsListPage from "./ResultsListPage";
import Eligibility from "../components/Eligibility";
import Ndis from "../components/Ndis";
import history, {onBack} from "../utils/history";


import {Category} from "../constants/categories";
import covidSupportCategories, {CovidSupportCategory}
    from "../constants/covidSupportCategories";

import type { Service } from "../iss";
import NotFoundStaticPage from "./NotFoundStaticPage"

type primaryInfo = {
    title: string,
    subtitle: string,
    body: string,
    learnMoreText: ?string,
    learnMoreLink: string,
}

type ExtraState = {
    primaryInfo: ?primaryInfo,
    keyInfo: ?Array<Object>
}

class ResultsPage extends BaseCategoriesPage<ExtraState> {
    constructor(props: Object) {
        super(props);
        const covidContent = this.getContent()

        this.state = {
            isClient: false,
            childServices: [],
            primaryInfo: covidContent.primaryInfo,
            keyInfo: covidContent.keyInfo,
        };
    }

    _component: any;
    _childComponent: any;

    issParams(): ?Object {
        // Build the search request.
        //
        // If we don't have enough information to build the search request
        // trigger the personalisation wizard.
        //
        // We have to do this once the component is mounted (instead of
        // in willTransitionTo because the personalisation components will
        // inspect the session).
        let request = this.search;

        for (let item of this.personalisationComponents) {
            // TODO: This needs to be debugged with the new flow version
            // flow:disable
            if (typeof item.getSearch === "function") {
                request = item.getSearch(request);

                if (!request) {
                    return null;
                }
            }
        }

        return request;
    }

    static getCovidCategory(slug: string): ?CovidSupportCategory {
        const cat: ?CovidSupportCategory = covidSupportCategories
            .find(cat => cat.slug === slug)

        return cat
    }

    componentDidMount(): void {
        super.componentDidMount();

        this.setState({ isClient: true });

        gtm.emit({
            event: "searchResults",
            searchQuery: this.props.match.params.search,
            searchPage: this.props.match.params.page,
            location: storage.getLocation(),
        });

        const request = this.issParams();

        if (!request) {
            const sep = this
                .props
                .location
                .pathname
                .endsWith("/") ? "" : "/";

            history.replace(
                `${this.props.location.pathname}${sep}personalise`
            );
            return;
        }

        iss.search(request)
            .then(data => {
                this.setState({
                    meta: data.meta,
                    objects: data.objects,
                    error: undefined,
                });
            })

            .catch(response => {
                try {
                    console.error(response, response.stack);

                    let data = JSON.parse(response.body);

                    this.setState({
                        error: data.error_message,
                        statusCode: response.statusCode,
                    });
                } catch (error) {
                    console.log(error)
                    this.setState({
                        error: `An error occurred. Please try again.`,
                        statusCode: response.statusCode,
                    });
                }

            });
    }

    get loading(): boolean {
        return !(this.state.meta || this.state.error);
    }

    async loadMore(): Promise<void> {
        gtm.emit({
            event: "LoadMoreSearchResults",
            searchQuery: this.props.match.params.search,
            searchPage: this.props.match.params.page,
            location: storage.getLocation(),
        });

        gtm.emit({
            event: "Load More Search Results Clicked",
            eventCat: "Content Expanded",
            eventAction: "Load More Search Results",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        }, "GTM-54BTPQM");

        if (!(this.state.meta && this.state.meta.next)) {
            return;
        }

        let next = this.state.meta.next;
        let data;

        /* reenable the search spinner */
        this.setState({meta: null});

        try {
            data = await iss.requestObjects(next);

            this.setState({
                meta: data.meta,
                objects: data.objects,
                error: undefined,
            });

        } catch (response) {
            try {
                data = JSON.parse(response.body);
                this.setState({
                    error: data.error_message,
                });
            } catch (error) {
                this.setState({
                    error: `An error occurred (${
                        response.statusCode || error
                    })`,
                    statusCode: response.statusCode,
                });
            }
        }
    }

    onBackClick(event: SyntheticInputEvent<>): void {
        onBack();
    }

    onServicesChange(services: Array<Service>) {
        this.setState({ childServices: services });
    }

    component(): React.ComponentType<any> {
        throw new Error("Override this class to implement `component`");
    }

    render() {
        const Component = this.component();

        if (!this.category &&
            (this.search.q === "undefined-search")) {
            return (
                <NotFoundStaticPage/>
            )
        }

        return (
            <div className="CovidSupportPage">
                <AppBar
                    title={this.title}
                    backMessage={this.backButtonMessage()}
                    onBackTouchTap={this.onBackClick.bind(this)}
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
                <div className="pageBanner">
                    <icons.Info className={"big middle"}/>
                    <span>You are using the Ask Izzy Beta.</span>
                </div>

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
                                {this.state.primaryInfo && <li><a href="#tools">{this.state.primaryInfo.title}</a></li>}
                                {this.state.keyInfo && <li><a href="#information">Key information</a></li>}
                                <li><a href="#services">Support services</a></li>
                            </ul>
                        </div>
                    }
                    bannerName={this.category && this.category.bannerImage ? this.category.bannerImage : "purple"}
                />

                { this.renderPrimaryInfo() }

                { this.renderKeyInfo() }

                <a className="anchor"
                    id="services"
                />
                <div className="supportServices">
                    <div className="heading">
                        <h3>Support services</h3>
                    </div>
                    <ul>
                        {(this.state.objects || []).map(object =>
                            <li className="result supportService"
                                key={object.id}
                            >
                                <Link
                                    className="title"
                                    to={`/service/${object.slug}`}
                                >
                                    <h3 className="name">
                                        {object.name}
                                    </h3>
                                </Link>
                                <h4 className="site_name">
                                    {object.site.name}
                                    <Ndis
                                        className="ndis"
                                        compact={true}
                                        object={object}
                                    />
                                </h4>
                                <div className="description">
                                    {object.shortDescription.map(
                                        (sentence, idx) =>
                                            <p key={idx}>{sentence}</p>
                                    )}
                                </div>
                                <Eligibility {...object} />
                                <Link
                                    className="learnMore"
                                    to={`/service/${object.slug}`}
                                >
                                Learn More
                                </Link>
                            </li>
                        )}
                    </ul>
                    {this.renderLoadMore()}
                </div>

                <div className="exitCovidFlowBox">
                    <h3>Can’t find what you’re looking for?</h3>
                    <span>Ask Izzy can help you to find the services{" "}
                    you need now, and nearby.</span>
                    <div className="return">
                        <Link
                            to="/"
                        >
                            Back to Ask Izzy home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    calculateMapHeight(): number {
        const selectedServices = this.state.childServices || [];
        let mapHeight = 2000;

        if (!this.state.isClient) {
            return mapHeight;
        }

        try {
            /* calculate the height of the map */
            /* TODO: Find why flow doesn't like the offsetHeight here
               Might be because the DOM isn't actually rendered? */

            mapHeight =
                window.innerHeight -
                // flow:disable
                document.querySelector(".AppBar").offsetHeight;

            /* resize the map to make room
             * for the selected results */
            mapHeight -= 150 * selectedServices.length;

            /* limit minimum height to 1/2 of the screen realestate */
            mapHeight = Math.max(mapHeight,
                window.innerHeight / 2);
        } catch (error) {
            //
        }

        return mapHeight;
    }

    getContent() {
        if (!this.category) {
            return {
                primaryInfo: undefined,
                keyInfo: undefined,
            };
        }
        const slug = this.category.slug;

        if (slug === "rent-and-tenancy") {
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
        } else if (slug === "money") {
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
        } else if (slug === "accommodation") {
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
        } else if (slug === "food-and-everyday-things") {
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
        } else if (slug === "mental-health") {
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

    renderLoadMore() {
        if (this.state.meta && this.state.meta.next) {
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

    backButtonMessage(): string {
        // FIXME: Should be category name if no marker is selected
        return ""
    }

}

export default ResultsPage;

export class ResultsPageListing extends ResultsPage {

    component(): React.ComponentType<any> {
        return ResultsListPage;
    }

    backButtonMessage(): string {
        return "Home Page"
    }
}

export class ResultsPageMap extends ResultsPage {

    component(): React.ComponentType<any> {
        return ResultsMap;
    }
}
