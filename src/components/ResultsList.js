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
import SortResult from "./SortResult";
import Category from "../constants/Category";
import {sortResults, SortType} from "./SortResult.service";
import _ from "underscore";

const StaticTextLine = ({object}) => React.cloneElement(object.node);

const className = (elem: React.Element<any>) =>
    `resultContainer resultContainer-${
        elem.type.displayName || "other"}`

class ResultsList extends React.Component<{
    results: Array<Service>,
    category: Category,
}, void> {

    constructor(props) {
        super(props);
        this.state = {
            orderBy: SortType,
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
                <SortResult
                    category={this.props.category}
                    orderBy={(orderBy) => {
                        this.setState({orderBy})
                    }}
                />
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
