/* @flow */

import React from "react";
import PropTypes from "proptypes";
import _ from "underscore";

import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from
    "../components/ResultsListPage/LoadingResultsHeader";
import LimitedServicesBanner from "../components/LimitedServicesBanner";
import ViewOnMapButton from "../components/ViewOnMapButton";

import * as gtm from "../google-tag-manager";
import storage from "../storage";
import type { Service } from "../iss";
import type Category from "../constants/Category";

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
    covidCategory?: Object
}

class ResultsListPage extends React.Component<Props, void> {
    static propTypes = {
        objects: PropTypes.array,
    };

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
                <LoadingResultsHeader {...this.props} />
                <div className="List results">
                    {
                        _.isEmpty(this.props.objects) || (
                            <React.Fragment>
                                <LimitedServicesBanner />
                                <ViewOnMapButton
                                    to={path}
                                    onClick={this.recordMapClick.bind(this)}
                                />
                            </React.Fragment>
                        )
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
