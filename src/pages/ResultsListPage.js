/* @flow */

import React from "react";
import _ from "underscore";

import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from
    "../components/ResultsListPage/LoadingResultsHeader";
import ViewOnMapButton from "../components/ViewOnMapButton";
import sendEvent from "../google-tag-manager";
import storage from "../storage";
import type { Service } from "../iss";
import DemographicsIndigenous from "../pages/personalisation/DemographicsIndigenous"

type SearchOrCategory = {search: string} | {title: string};

class ResultsListPage extends React.Component {
    props: {
        loadMore: any,
        objects: Array<Service>,
        location: any,
        personalisationComponents: Array<Object>,
        title: string,
        statusCode: number,
        meta: {total_count: number},
        loading: boolean,
        error: string,
    } & SearchOrCategory;
    state: void;

    static propTypes = {
        objects: React.PropTypes.array,
    };

    recordMapClick(): void {
        if (this.props.search) {
            sendEvent({
                event: "ViewOnMap",
                search: this.props.search,
                location: storage.getLocation(),
            });
        } else if (this.props.category) {
            sendEvent({
                event: "ViewOnMap",
                category: this.props.category,
                location: storage.getLocation(),
            });
        }

    }

    render() {
        const path = this.props.location.pathname.replace(/\/?$/, "/map");

        var is_indigenous_search = false;
        var more_than_100_results = false;

        if (this.props.meta && this.props.meta.available_count >= 100) {
            more_than_100_results = true;
        }
        if (this.props.personalisationComponents) {
            const personalisations = [
                DemographicsIndigenous,
            ].filter((component) =>
                this.props.personalisationComponents.includes(component)
            )
            if (personalisations.length >= 1 && storage.getUserIsIndigenous() == true)
                is_indigenous_search = true;
        }

        if (is_indigenous_search==true && more_than_100_results==false)
        {
            console.log("handle special case!");
            return (
                <div className="ResultsListPage">
                    special case!
                </div>
            );
        }

        return (
            <div className="ResultsListPage">
                <LoadingResultsHeader {...this.props} />
                <div className="List results">
                    {
                        _.isEmpty(this.props.objects) ||
                        <ViewOnMapButton
                            to={path}
                            onClick={this.recordMapClick.bind(this)}
                        />
                    }
                    <ResultsList
                        results={this.props.objects || []}
                    />
                    {this.props.loadMore}
                </div>
            </div>
        );
    }

}

export default ResultsListPage;
