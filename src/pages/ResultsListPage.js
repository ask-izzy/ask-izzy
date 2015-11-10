/* @flow */

import React from "react";
import {Link} from "react-router";

import BaseResultsPage from "./BaseResultsPage";
import components from "../components";
import icons from "../icons";

declare var SITE_DOMAIN: string;

class ResultsListPage extends BaseResultsPage {
    render(): ReactElement {
        let history = this.props.history;

        return (
            <div className="ResultsListPage">
                <components.AppBar
                    title={this.title}
                    onBackTouchTap={history.goBack.bind(history)}
                />
                <components.Printable
                    screen={
                        <components.HeaderBar
                            primaryText={
                                this.state.meta ?
                                    this.state.meta.total_count > 0 ?
                                        this.renderHeaderSuccess()
                                    : <div>
                                         Sorry, I couldn't find any results
                                         for {this.title.toLocaleLowerCase()}.
                                     </div>
                                : this.state.error ?
                                    <div>
                                        <components.LogoWithShadow />
                                        Sorry, I couldn't do this search.
                                    </div>
                                : <div>Searching...</div>
                            }
                            secondaryText={
                                this.state.statusCode == 402 ?
                                    <div>
                                        {this.renderErrorMessage()}
                                        {this.renderHomeLink()}
                                        {' '}
                                        {this.renderPersonalisationLink()}
                                    </div>
                                : this.state.error ?
                                    <div>
                                        {this.renderErrorMessage()}
                                        {this.renderHomeLink()}
                                    </div>
                                : <div>
                                    {this.renderInfo()}
                                    {this.renderPersonalisationLink()}
                                  </div>
                            }
                        />
                    }
                    print={
                        <components.BrandedHeader />
                    }
                />

                {this.renderResults()}

                {this.state.meta || this.state.error ? ""
                : <div className="progress">
                      <icons.Loading />
                  </div>
                }

            </div>
        );
    }

    renderHeaderSuccess(): ReactElement {
        return (
                <div>
                    I found these services for you
                    <components.LogoWithShadow />
                </div>);
    }

    renderErrorMessage(): ReactElement {
        let message = this.state.error;

        return (<p className="errorMessage">{message}</p>);
    }

    renderHomeLink(): ReactElement {
        let linkText = "Go back";

        return (<Link
            className="homeLink"
            to="home"
                >{linkText}</Link>);
    }

    renderInfo(): ?ReactElement {
        // this.category is a getter which can
        // throw an exception if category is not
        // set
        try {
            return <div>{this.category.info}</div>;
        } catch (error) {
            return undefined;
        }
    }

    renderPersonalisationLink(): ReactElement {
        const current = this.props.location.pathname;
        const separator = current.endsWith("/") ? "" : "/";

        return (
            <Link
                className="change-personalisation"
                to={`${current}${separator}personalise/summary`}
            >
                Change your answers
            </Link>
        );
    }

    renderResults(): ReactElement {
        return (
            <div className="List results">
                <components.Printable
                    screen={
                        (
                            this.state.objects &&
                            this.state.objects.length
                        ) &&
                        <components.LinkListItem
                            className="ViewOnMapButton"
                            to={this.props.location.pathname + "/map"}
                            primaryText="View on a map"
                            leftIcon={
                                <icons.Map />
                            }
                            rightIcon={
                                <icons.Chevron />
                            }
                        />
                    }
                    print={
                        <components.LinkListItem
                            className="PrintContext"
                            leftIcon={
                                this.props.params.search ?
                                <icons.Search />
                                : <this.category.icon />
                            }
                            primaryText={
                                <div>
                                    <span className="title">
                                        {this.title}
                                    </span> - https://{SITE_DOMAIN}{this.props.location.pathname}
                                </div>
                            }
                        />
                    }
                />
                <components.ResultList
                    results={this.results}
                />
                {
                    this.state.meta && this.state.meta.next ?
                        <components.ButtonListItem
                            className="MoreResultsButton"
                            primaryText="Load more results…"
                            onTouchTap={this.loadMore.bind(this)}
                        />
                    : ""
                }
            </div>
        );
    }
}

export default ResultsListPage;
