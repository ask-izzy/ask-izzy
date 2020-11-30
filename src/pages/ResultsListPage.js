/* @flow */

import React from "react";

import AppBar from "../components/AppBar";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import ResultsPage from "./ResultsPage";
import ResultsList from "../components/ResultsList";
import HeaderBar from "../components/HeaderBar";
import Switch from "../components/Switch";
import ViewOnMapButton from "../components/ViewOnMapButton";
import icons from "../icons";
import UserSnapResults from "../components/feedback/UserSnapResults";
import NotFoundStaticPage from "./NotFoundStaticPage";
import ContentList from "../components/content/ContentList";

import * as gtm from "../google-tag-manager";
import storage from "../storage";
import type { Service } from "../iss";
import type Category from "../constants/Category";
import { stateFromLocation } from "../utils";

import routerContext from "../contexts/router-context";
import Query from "../queries/query";
import externalResourcesQuery from "../queries/content/externalResources.js";

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

type ExtraState = {
    hasInfo: boolean,
    hasTools: boolean,
}

class ResultsListPage extends ResultsPage<Props, ExtraState> {
    static contextType = routerContext;

    constructor(props: Object, context: Object) {
        super(props, context);

        this.state = {
            ...this.state,
            hasInfo: false,
            hasTools: false,
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

    get CMSCategoryName(): string {
        let catName = this.category.title
        const subCategory = this.category.slug === "money" &&
            storage.getItem("sub-money")

        if (this.category.slug === "money" && subCategory === "Centrelink") {
            catName = "Centrelink"
        }

        return catName
    }

    render() {
        if (this.state.searchType) {
            return this.renderPage()
        } else {
            return <NotFoundStaticPage/>
        }
    }

    renderPage = () => (
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
                            {this.state.hasTools && (
                                <li><a href="#tools">
                                    <icons.DownArrow />Highlighted resource
                                </a></li>
                            )}
                            {this.state.hasInfo && (
                                <li><a href="#information">
                                    <icons.DownArrow />Key information
                                </a></li>
                            )}
                            <li><a href="#services">
                                <icons.DownArrow />Support services
                            </a></li>
                        </ul>
                    </div>
                }
                bannerName={this.category && this.category.bannerImage ?
                    this.category.bannerImage
                    : "homepage"
                }
            />

            { this.renderPrimaryInfo() }

            { this.renderKeyInfo() }

            { this.renderSupportServices() }
        </div>
    )

    renderLoadingComponent = () => (
        <div className="resultsStatus">
            <icons.Loading className="big" />
        </div>
    )

    renderLoadingComponent() {
        return (
            <div className="progress"><icons.Loading className="big" /></div>
        )
    }

    renderPrimaryInfo() {
        if (!this.category) {
            return null
        }
        return (
            <Query
                query={externalResourcesQuery}
                loadingComponent={this.renderLoadingComponent()}
                args={
                    {
                        "category": [this.CMSCategoryName],
                        "tag": [
                            "Tool",
                        ],
                        "state": [
                            stateFromLocation(),
                        ],
                    }
                }
                dataLoadedCallback={data =>
                    data.externalResources.length > 0 &&
                        this.setState({ hasTools: true })
                }
            >
                {({data}) => {
                    if (data.externalResources.length > 0) {
                        return (<React.Fragment>
                            <a className="anchor"
                                id="tools"
                            />
                            <div
                                className="primaryInfo"
                                ref={
                                    element => (
                                        this.primaryInfoEl = element
                                    )
                                }
                            >
                                <ContentList
                                    className="featured"
                                    items={data.externalResources}
                                />
                            </div>
                        </React.Fragment>)
                    }
                    return null
                }}
            </Query>
        )
    }

    renderKeyInfo() {
        if (!this.category) {
            return null
        }
        return (
            <Query
                query={externalResourcesQuery}
                loadingComponent={this.renderLoadingComponent()}
                args={
                    {
                        "category": [this.CMSCategoryName],
                        "tag": [
                            "Information",
                        ],
                        "state": [
                            stateFromLocation(),
                        ],
                    }
                }
                dataLoadedCallback={data =>
                    data.externalResources.length > 0 &&
                        this.setState({ hasInfo: true })
                }
            >
                {({data}) => (
                    !data.externalResources.length > 0 ? "" : (
                        <React.Fragment>
                            <a
                                className="anchor"
                                id="information"
                            />
                            <div
                                className="keyInfo"
                                ref={element => (this.keyInfoEl = element)}
                            >
                                <h3>Key information</h3>
                                <ContentList
                                    items={data.externalResources}
                                />
                            </div>
                        </React.Fragment>
                    )
                )}
            </Query>
        )
    }

    renderSupportServices = () => <>
        <a className="anchor"
            id="services"
        />
        <div className="supportServices">
            <div className="heading">
                <h3>Support services</h3>
                {this.showMapButton && <>
                    <hr />
                    <ViewOnMapButton
                        to={
                            this.props.location.pathname.replace(/\/?$/, "/map")
                        }
                        onClick={this.recordMapClick.bind(this)}
                    />
                </>}
            </div>
            <Switch>
                <div switch-if={this.state.searchResults?.length === 0}
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
            {this.state.searchError &&
            <div switch-if={this.state.searchError}
                className="resultsStatus"
            >
                Sorry, an error occurred. Please try again.
            </div>
            }
            <Switch>
                <div
                    switch-if={this.searchIsLoading}
                    className="resultsStatus"
                >
                    <icons.Loading className="big" />
                </div>
                <div
                    switch-if={this.searchHasNextPage}
                    className="loadMore"
                >
                    <button onClick={this.loadNextSearchPage}>
                    Load more results…
                    </button>
                </div>
            </Switch>
            { !this.searchIsLoading && this.state.searchPagesLoaded > 2 &&
            <UserSnapResults />
            }
        </div>
    </>

    get showMapButton(): boolean {
        return !this.state.searchError &&
            this.state.searchResults?.length !== 0
    }
}

export default ResultsListPage;
