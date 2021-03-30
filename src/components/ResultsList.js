/* @flow */

import * as React from "react";

import ResultListItem from "../components/ResultListItem";
import CrisisLineItem from "../components/CrisisLineItem";
import CrisisHeader from "../components/CrisisHeader";
import {
    crisisResults,
    nonCrisisResults,
} from "../iss";

import type { Service } from "../iss";

const StaticTextLine = ({object}) => React.cloneElement(object.node);

const className = (elem: React.Element<any>) =>
    `resultContainer resultContainer-${
        elem.type.displayName || "other"}`

class ResultsList extends React.Component<{
    results: Array<Service>,
}, void> {
    crisisResults(): Array<Object> {
        return crisisResults(this.props.results);
    }

    nonCrisisResults(): Array<Object> {
        return nonCrisisResults(this.props.results);
    }

    render() {
        return (
            <div className="ResultList">
                {
                    (this.crisisResults().length > 0) &&
                    <CrisisHeader
                        plural={this.crisisResults().length > 1}
                    />
                }
                {this.crisisResults().map(this.renderCrisisResult.bind(this))}
                {this.nonCrisisResults().map(this.renderResult.bind(this))}
            </div>
        );
    }

    renderCrisisResult(object: Object, index: number) {
        const elem: React.Element<any> = object.staticText ?
            <StaticTextLine object={object} />
            : <CrisisLineItem object={object} />;

        return (
            <div
                key={`crisis-${index}`}
                className={className(elem)}
            >
                {elem}
            </div>
        );
    }

    renderResult(object: Object, index: number) {
        const elem = <ResultListItem service={object} />;

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
