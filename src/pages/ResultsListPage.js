/* @flow */

import React from "react";
import _ from "underscore";

import ResultsList from "../components/ResultsList";
import LoadingResultsHeader from
    "../components/ResultsListPage/LoadingResultsHeader";
import ViewOnMapButton from "../components/ViewOnMapButton";

class ResultsListPage extends React.Component {

    static propTypes = {
        objects: React.PropTypes.array,
    };

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
                        results={this.props.objects || []}
                    />
                    {this.props.loadMore}
                </div>
            </div>
        );
    }

}

export default ResultsListPage;
