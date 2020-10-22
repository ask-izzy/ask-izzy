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
import ContentList from "../components/content/ContentList";

import covidSupportCategories, {CovidSupportCategory}
    from "../constants/covidSupportCategories";

import Query from "../queries/query";
import externalResourcesQuery from "../queries/content/externalResources.js";

import type { Service } from "../iss";
import NotFoundStaticPage from "./NotFoundStaticPage"
import { stateFromLocation } from "../utils";
import {onBack} from "../utils/history";

type ExtraState = {
    covidCategory: Object,
}

class CovidSupportPage extends BaseCategoriesPage<ExtraState> {
    constructor(props: Object) {
        super(props);
        const covidCategory = CovidSupportPage.getCovidCategory(
            this.props.match.params.supportCategorySlug
        )

        this.state = {
            isClient: false,
            childServices: [],
            covidCategory: covidCategory,
        };
    }

    _component: any;
    _childComponent: any;

    issParams(): ?Object {
        let query = Object.assign(
            {},
            (this.state.covidCategory && this.state.covidCategory.query) || {}
        )

        query.area = storage.getLocation()
        query.limit = 2
        return query
    }

    static getCovidCategory(slug: string): ?CovidSupportCategory {
        const cat: ?CovidSupportCategory = covidSupportCategories
            .find(cat => cat.slug === slug)

        return cat
    }

    get title(): string {
        return (this.state.covidCategory && "Covid Info - " +
            this.state.covidCategory.title) || "Page Not Found"
    }

    getContentCat(slug: string): string {
        // Given a covid category slug, return the matching content category.
        switch (slug) {
        case "money":
            return "Money help";
        case "place-to-stay":
            return "Housing";
        case "rent-or-tenancy":
            return "Rent";
        case "food-and-everyday":
            return "Food";
        case "mental-health":
            return "Mental health";
        default:
            break;
        }
        return "";
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

            this.context.router.replace(
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
                    console.error(response)
                    console.error(response.stack);

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

    onServicesChange(services: Array<Service>) {
        this.setState({ childServices: services });
    }

    component(): React.ComponentType<any> {
        throw new Error("Override this class to implement `component`");
    }

    render() {
        const covidCategory = this.state.covidCategory
        const loadingComponent = (
            <div className="progress"><icons.Loading className="big" /></div>
        )

        if (!covidCategory) {
            return (
                <NotFoundStaticPage/>
            )
        } else {
            return (
                <div className="CovidSupportPage">
                    <AppBar
                        title={this.title}
                        backMessage={this.backButtonMessage()}
                        onBackTouchTap={onBack}
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
                        <h3>Beta COVID-19 support page for those in{" "}
                        Victoria.</h3>
                        <div>We have added a new section to Ask Izzy for{" "}
                        people who have been impacted by the coronavirus{" "}
                        (COVID-19) pandemic, in Victoria. Please be aware{" "}
                        that some services may not be operating or{" "}
                        offering a limited range of services during this time.
                        </div>
                    </div>

                    <HeaderBar
                        className="LoadingResultsHeader"
                        primaryText={
                            <div className="LogoHeader">
                                {covidCategory.title}
                            </div>
                        }
                        secondaryText={
                            <div>
                                Helpful <a href="#tools">tools</a>,
                                {" "}<a href="#information">information</a> and
                                {" "}<a href="#services">services</a> nearby.
                            </div>
                        }
                        bannerName={"purple covid_" + covidCategory.slug}
                    />

                    <a
                        className="anchor"
                        id="tools"
                    />

                    <Query
                        query={externalResourcesQuery}
                        loadingComponent={loadingComponent}
                        args={
                            {
                                "category": [
                                    this.getContentCat(
                                        this.state.covidCategory.slug
                                    ),
                                ],
                                "tag": [
                                    "Tool",
                                ],
                                "state": [
                                    stateFromLocation(),
                                ],
                            }
                        }
                    >
                        {data => (
                            !data.data.externalResources.length > 0 ? "" : (
                                <div className="primaryInfo">
                                    <ContentList
                                        className="featured"
                                        items={data.data.externalResources}
                                    />
                                </div>
                            )
                        )}
                    </Query>

                    <a
                        className="anchor"
                        id="information"
                    />

                    <Query
                        query={externalResourcesQuery}
                        loadingComponent={loadingComponent}
                        args={
                            {
                                "category": [
                                    this.getContentCat(
                                        this.state.covidCategory.slug
                                    ),
                                ],
                                "tag": [
                                    "Information",
                                ],
                                "state": [
                                    stateFromLocation(),
                                ],
                            }
                        }
                    >
                        {data => (
                            !data.data.externalResources.length > 0 ? "" : (
                                <div className="keyInfo">
                                    <h3>Key Information</h3>
                                    <ContentList
                                        items={data.data.externalResources}
                                    />
                                </div>
                            )
                        )}
                    </Query>

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
                                    <h3 className="name">
                                        <Link
                                            className="title"
                                            to={`/service/${object.slug}`}
                                        >
                                            {object.name}
                                        </Link>
                                    </h3>
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

                    <div className="otherCovidSupportCategories">
                        <h3>Explore more helpful content for those{" "}
                        affected by the pandemic.</h3>
                        <ul>
                            {covidSupportCategories
                                .filter(
                                    cat =>
                                        cat.slug !== covidCategory.slug
                                )
                                .map(category =>
                                    <LinkListItem
                                        className="CategoryListItem hero"
                                        to={
                                            "/covid-19-support/" +
                                            category.slug
                                        }
                                        leftIcon={
                                            <category.icon
                                                className="ColoredIcon
                                                    icon-fg-color big"
                                            />
                                        }
                                        key={category.slug}
                                        rightIcon={<icons.Chevron />}
                                        primaryText={category.title}
                                        secondaryText={category.subtitle}
                                    />
                                )}
                        </ul>
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
                // $FlowIgnore
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

    backButtonMessage(): string {
        // FIXME: Should be category name if no marker is selected
        return ""
    }

}

export default CovidSupportPage;

export class CovidSupportPageListing extends CovidSupportPage {

    component(): React.ComponentType<any> {
        return ResultsListPage;
    }

    backButtonMessage(): string {
        return "Home Page"
    }
}

export class CovidSupportPageMap extends CovidSupportPage {

    component(): React.ComponentType<any> {
        return ResultsMap;
    }
}
