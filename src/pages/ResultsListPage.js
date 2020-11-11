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
import resultsContent from "../results-content.json"
import HeaderBar from "../components/HeaderBar";
import LimitedServicesBanner from "../components/LimitedServicesBanner";
import ViewOnMapButton from "../components/ViewOnMapButton";
import icons from "../icons";
import routerContext from "../contexts/router-context";

import * as gtm from "../google-tag-manager";
import storage from "../storage";
import type { Service } from "../iss";
import type { Category } from "../constants/categories";


type primaryInfo = {
    name: String,
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
    componentDidMount() {
        super.componentDidMount();

        // We have to load this after the first render so we match
        // server-rendered markup on hydrate stage
        const subCategory = this.category.slug === 'money' && 
            storage.getItem('sub-money')
        const topicInfo = this.category && getTopicInfo(
            this.category,
            subCategory,
            storage.getLocation()
        )
        this.setState({
            primaryInfo: topicInfo && topicInfo.primaryInfo,
            keyInfo: topicInfo && topicInfo.keyInfo,
        })
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
                    backMessage={"Home Page"}
                    onBackTouchTap={() => this.context.router.history.push("/")}
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
                    bannerName={this.category && this.category.bannerImage ? this.category.bannerImage : "purple"}
                />

                { this.state.primaryInfo && this.renderPrimaryInfo() }

                { this.state.keyInfo && this.renderKeyInfo() }

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
function getTopicInfo(category, subCategory, location) {
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
    if (category.slug === 'money' && subCategory === 'Centrelink') {
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
            name: content['Name'],
            title: content['Display Title'],
            subtitle: content['Subtitle'],
            body: content['Body text'],
            learnMoreText: content['Link text'],
            learnMoreLink: content['Link URL'],
            type: content['Type'],
            original: content
        }))
    const primaryInfo = relevantResultsContent
            .filter(content => content.type === "Primary Info").shift();
    const keyInfo = relevantResultsContent
            .filter(content => content.type === "Secondary Info");

    return {
        primaryInfo,
        keyInfo: keyInfo.length ? keyInfo : undefined
    }
}

