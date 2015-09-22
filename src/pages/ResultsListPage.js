/* @flow */

import React from "react";
import Router from "react-router";
import mui from "material-ui";

import BaseResultsPage from "./BaseResultsPage";
import components from "../components";
import icons from "../icons";

class ResultsListPage extends BaseResultsPage {
    render(): ReactElement {

        return (
            <div className="ResultsListPage">
                <components.AppBar
                    title={this.title}
                    onBackTouchTap={this.goBack.bind(this)}
                />

                <components.HeaderBar
                    primaryText={
                        this.state.meta ?
                            this.state.meta.total_count > 0 ?
                                <div>
                                    I found {this.state.meta.total_count}{' '}
                                    {this.title.toLocaleLowerCase()}{' '}
                                    services for{' '}
                                    {this.state.meta.location.name},{' '}
                                    {this.state.meta.location.state}.
                                    <icons.LogoLight />
                                </div>
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

    renderErrorMessage(): ReactElement {

        var message = this.state.error;

        return (<p className="errorMessage">{message}</p>);
    }

    renderHomeLink(): ReactElement {

        var linkText = "Go back";

        return (<Router.Link
            className="homeLink"
            to="home"
                >{linkText}</Router.Link>);
    }

    renderPersonalisationLink(): ReactElement {

        var personaliseLink = `${this.getPath()}/personalise/summary`;

        return (<Router.Link
            className="personalisationLink"
            to={personaliseLink}
                >Change what you need</Router.Link>);
    }

    renderResults(): ReactElement {

        return (
            <mui.List className="List results">
            {
                this.state.objects ?
                    <mui.ListItem
                        className="ViewOnMapButton"
                        primaryText="View on a map"
                        containerElement={
                            <Router.Link
                                to={this.getPathname() + "/map"}
                            />
                        }
                        leftIcon={
                            <icons.Map />
                        }
                        rightIcon={
                            <icons.Chevron />
                        }
                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    />
                : ""
            }
            <div className="resultsContainer">{
                this.results.map((object, index) => {
                    var elem = object.infobox ?
                        React.addons.cloneWithProps(object.node)
                    : object.crisis ?
                        <components.CrisisLineItem
                            object={object}
                        />
                    : <components.ResultListItem
                        object={object}
                      />;

                    var klass = elem.displayName || "other";

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
                    <mui.ListItem
                        className="MoreResultsButton"
                        primaryText="Load more results…"
                        onTouchTap={this.loadMore.bind(this)}

                        disableFocusRipple={true}
                        disableTouchRipple={true}
                    />
                : ""
            }
            </mui.List>
        );
    }
}

export default ResultsListPage;
