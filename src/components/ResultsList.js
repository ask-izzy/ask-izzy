/* @flow */

import * as React from "react";

import ResultListItem from "../components/ResultListItem";
import CrisisLineItem from "../components/CrisisLineItem";
import CrisisHeader from "../components/CrisisHeader";
import {
    crisisResults,
    nonCrisisResults,
} from "../iss";

import type {Service} from "../iss";
import Category from "../constants/Category";
import {sortResults} from "./SortResult.service";
import type {SortType} from "./SortResult.service"
import SortFilterResult from "./SortFilterResult";

const StaticTextLine = ({object}) => React.cloneElement(object.node);

const className = (elem: React.Element<any>) =>
    `resultContainer resultContainer-${
        elem.type.displayName || "other"}`

type State = {
    orderBy: ?SortType,
    filterBy: ?SortType,
}

type Props = {
    results: Array<Service>,
    category: ?Category,
    filterOption?: function,
    hideOptions?: ?boolean,
    loading?: ?boolean,
}

class ResultsList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            orderBy: null,
            filterBy: null,
        }
    }

    crisisResults(): Array<Object> {
        return crisisResults(this.props.results);
    }

    nonCrisisResults(): Array<Object> {
        const res = nonCrisisResults(this.props.results);
        return this.state.orderBy?.value ?
            sortResults(res, this.state.orderBy) : res;
    }

    render(): React.Element<"div"> {
        return (
            <div className="ResultsList">
                {
                    (this.crisisResults().length > 0) &&
                    <CrisisHeader
                        plural={this.crisisResults().length > 1}
                    />
                }
                {this.crisisResults().map(this.renderCrisisResult.bind(this))}
                {this.state.filterBy ||
                this.props.results &&
                this.props.results.length ?
                    <div>
                        <SortFilterResult
                            category={this.props.category}
                            hideOptions={this.props.hideOptions}
                            loading={this.props.loading}
                            orderByCallback={(orderBy) => {
                                this.setState({orderBy});
                            }}
                            filterByCallback={(filterBy) => {
                                this.setState({filterBy})
                                this.props.filterOption &&
                                this.props.filterOption(filterBy)
                            }}
                        />
                    </div> : null}
                {this.nonCrisisResults().map(this.renderResult.bind(this))}
            </div>
        );
    }

    renderCrisisResult(object: Object, index: number): React.Element<"div"> {
        const elem: React.Element<any> = object.staticText ?
            <StaticTextLine object={object}/>
            : <CrisisLineItem object={object}/>;

        return (
            <div
                key={`crisis-${index}`}
                className={className(elem)}
            >
                {elem}
            </div>
        );
    }

    renderResult(object: Object, index: number): React.Element<"div"> {
        const elem = <ResultListItem service={object}/>;

        return (
            <div
                key={`regular-${index}`}
                className={className(elem)}
            >
                {elem}
            </div>
        );
    }
}

export default ResultsList;
