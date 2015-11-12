/* @flow */

import React from "react";
import {Link} from "react-router";
import _ from "underscore";

import components from "../components";
import icons from "../icons";

class ResultsListPage extends React.Component {

    // flow:disable not supported yet
    get results(): Array<iss.issService> {
        let objects, index;

        if (this.props.objects) {
            objects = Array.from(this.props.objects);
        } else {
            objects = [];
        }

        // Infoboxes are no longer inline (moved to headers). Keeping this
        // code as @danni pointed out it's not likely to revert cleanly.
        //
        // /* splice in an infobox (if it exists) after the first non-crisis
        //  * service */
        /*
        try {
            let infobox = this.category.info;

            index = _.findIndex(objects,
                                object => !object.crisis && !object.infobox);

            if (infobox && index != -1) {
                objects.splice(index + 1, 0, {
                    infobox: true,
                    node: infobox,
                });
            }
        } catch (error) {
            // pass
        }
        */
        /* splice a header before the first crisis service */
        index = _.findIndex(objects, object => object.crisis);
        if (index != -1) {
            /* count hotlines */
            let nhotlines = _.where(objects, {crisis: true}).length;

            objects.splice(index, 0, {
                staticText: true,
                node: (
                    <h3 className="CrisisHeader">
                    {nhotlines == 1 ?
                      "If you need urgent help call this number"
                    : "If you need urgent help call one of these numbers"}
                    </h3>
                ),
            });
        }

        return objects;
    }

    render(): ReactElement {
        return (
            <div className="ResultsListPage">

                <components.HeaderBar
                    primaryText={
                        this.props.meta ?
                            this.props.meta.total_count > 0 ?
                                this.renderHeaderSuccess()
                            : <div>
                                 Sorry, I couldn't find any results
                                 for {this.title.toLocaleLowerCase()}.
                             </div>
                        : this.props.error ?
                            <div>
                                <components.LogoWithShadow />
                                Sorry, I couldn't do this search.
                            </div>
                        : <div>Searching...</div>
                    }
                    secondaryText={
                        this.props.statusCode == 402 ?
                            <div>
                                {this.renderErrorMessage()}
                                {this.renderHomeLink()}
                                {' '}
                                {this.renderPersonalisationLink()}
                            </div>
                        : this.props.error ?
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

            </div>
        );
    }

    renderHeaderSuccess(): ReactElement {
        return (
            <div>
                I found these services for you
                <components.LogoWithShadow />
            </div>
        );
    }

    renderErrorMessage(): ReactElement {
        let message = this.props.error;

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
            {
                (this.props.objects && this.props.objects.length) ?
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
            {this.props.loadMore}
            </div>
        );
    }
}

export default ResultsListPage;
