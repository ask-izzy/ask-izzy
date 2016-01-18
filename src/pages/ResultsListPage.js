/* @flow */

import React from "react";
import _ from "underscore";

import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from
    "../components/ResultsListPage/LoadingResultsHeader";
import ViewOnMapButton from "../components/ViewOnMapButton";

class ResultsListPage extends React.Component {

    get results(): Array<Object> {
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
            const nhotlines = _.where(objects, {crisis: true}).length;

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
        const path = this.props.location.pathname.replace(/\/?$/, "/map");

        return (
            <div className="ResultsListPage">
                <LoadingResultsHeader {...this.props} />
                <div className="List results">
                    {
                        _.isEmpty(this.props.objects) ||
                        <ViewOnMapButton
                            to={path}
                        />
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
