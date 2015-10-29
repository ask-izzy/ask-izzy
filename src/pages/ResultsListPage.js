/* @flow */

import React from "react";
import {Link} from "react-router";

import BaseResultsPage from "./BaseResultsPage";
import components from "../components";
import icons from "../icons";

class ResultsListPage extends BaseResultsPage {
    render(): ReactElement {
        let history = this.props.history;

        return (
            <div className="ResultsListPage">
                <components.AppBar
                    title={this.title}
                    onBackTouchTap={history.goBack.bind(history)}
                />

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
                                <icons.LogoLight />
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
                    <icons.LogoLight />
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
            <Link to={`${current}${separator}personalise/summary`}>
                Change what I'm looking for
            </Link>
        );
    }

    renderResults(): ReactElement {

        return (
            <div className="List results">
            {
                (this.state.objects && this.state.objects.length) ?
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
                : ""
            }
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
