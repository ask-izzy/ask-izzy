/* @flow */

import * as React from "react";
import {Link} from "react-router-dom";

import iss from "../iss";
import BaseCategoriesPage from "./BaseCategoriesPage";
import icons from "../icons";
import storage from "../storage";
import * as gtm from "../google-tag-manager";

import AppBar from "../components/AppBar";
import DebugContainer from "../components/DebugContainer";
import DebugPersonalisation from "../components/DebugPersonalisation";
import DebugSearch from "../components/DebugSearch";
import HeaderBar from "../components/HeaderBar";
import LinkListItem from "../components/LinkListItem";
import ResultsListPage from "./ResultsListPage";
import ViewOnMapButton from "../components/ViewOnMapButton";
import Eligibility from "../components/Eligibility";
import OpeningTimes from "../components/OpeningTimes";
import Ndis from "../components/Ndis";
import history, {onBack} from "../utils/history";
import type {searchResultsMeta, Service} from "../iss";


import {Category} from "../constants/categories";
import covidSupportCategories, {CovidSupportCategory}
    from "../constants/covidSupportCategories";

import NotFoundStaticPage from "./NotFoundStaticPage"

type State = {
    searchResultsMeta?: ?searchResultsMeta,
    searchResults: Array<Service>,
}


class ResultsPage<ChildProps = {...}, ChildState = {...}>
extends BaseCategoriesPage<ChildProps, State & ChildState> {
    constructor(props: Object) {
        super(props);

        this.state = {
            searchResultsMeta: undefined,
            searchResults: [],
        };
    }

    _component: any;

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
                .match
                .url
                .endsWith("/") ? "" : "/";

            history.replace(
                `${this.props.match.url}${sep}personalise`
            );
            return;
        }

        iss.search(request)
            .then(data => {
                this.setState({
                    searchResultsMeta: data.meta,
                    searchResults: data.objects,
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

        if (!(this.state.searchResultsMeta && this.state.searchResultsMeta.next)) {
            return;
        }

        let next = this.state.searchResultsMeta.next;
        let data;

        /* reenable the search spinner */
        this.setState({searchResultsMeta: null});

        try {
            data = await iss.requestObjects(next);

            this.setState({
                searchResultsMeta: data.meta,
                searchResults: data.objects,
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
        history.push("/");
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
            <div className="ResultsPage">
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

                <a className="anchor"
                    id="services"
                />
                <div className="supportServices">
                    <div className="heading">
                        <h3>Support services</h3>
                        <ViewOnMapButton
                            to={this.props.location.pathname.replace(/\/?$/, "/map")}
                            onClick={this.recordMapClick.bind(this)}
                        />
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
                                {object.open.now_open === false && (<OpeningTimes
                                    className="opening_hours"
                                    object={object.open}
                                    compact={true}
                                />)}
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

    backButtonMessage(): string {
        // FIXME: Should be category name if no marker is selected
        return ""
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

}

export default ResultsPage;

// export class ResultsPageListing extends ResultsPage {

//     component(): React.ComponentType<any> {
//         return ResultsListPage;
//     }

//     backButtonMessage(): string {
//         return "Home Page"
//     }
// }

// export class ResultsPageMap extends ResultsPage {

//     component(): React.ComponentType<any> {
//         return ResultsMap;
//     }
// }
