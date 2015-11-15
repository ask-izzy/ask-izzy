/* @flow */

import React from "react";
import _ from "underscore";

import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from "../components/LoadingResultsHeader";
import ViewOnMapButton from "../components/ViewOnMapButton";

class ResultsListPage extends React.Component {

    // flow:disable not supported yet
    get results(): Array<iss.issService> {
        let objects, index;

        if (this.props.objects) {
            objects = Array.from(this.props.objects);
        } else {
            objects = [];
        }

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
                <LoadingResultsHeader {...this.props} />
                <div className="List results">
                    {
                        (this.props.objects && this.props.objects.length) ?
                            <ViewOnMapButton
                                to={this.props.location.pathname + "/map"}
                            />
                        : ""
                    }
                    <ResultsList
                        results={this.results}
                    />
                    {this.props.loadMore}
                </div>
            </div>
        );
    }

}

export default ResultsListPage;
