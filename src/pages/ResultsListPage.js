/* @flow */

import React from "react";
import _ from "underscore";

import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from
    "../components/ResultsListPage/LoadingResultsHeader";
import ViewOnMapButton from "../components/ViewOnMapButton";
import sendEvent from "../google-tag-manager";
import storage from "../storage";

class ResultsListPage extends React.Component {
    props: Object;
    state: void;

    static propTypes = {
        objects: React.PropTypes.array,
    };

    recordMapClick(): void {
        sendEvent({
            event: "ViewOnMap",
            category: this.props.category,
            search: this.props.search,
            location: storage.getLocation(),
        });
    }

    render() {
        const path = this.props.location.pathname.replace(/\/?$/, "/map");

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
