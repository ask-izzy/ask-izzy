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
        return (
            <Link to={this.props.location.pathname + "/personalise/summary"}>
                Change what I'm looking for
            </Link>
        );
    }

    renderResults(): ReactElement {

        return (
            <div className="List results">
            {
                this.state.objects ?
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
            <div className="resultsContainer">{
                this.results.map((object, index) => {
                    let elem = object.staticText ?
                        React.cloneElement(object.node)
                    : object.crisis ?
                        <components.CrisisLineItem
                            object={object}
                        />
                    : <components.ResultListItem
                        object={object}
                      />;

                    let klass = elem.type.displayName || "other";

                    return (
                        <div
                            key={index}
                            className={
                                `resultContainer resultContainer-${klass}`
                            }
                        >
                            {elem}
                        </div>);
                })
            }</div>
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
