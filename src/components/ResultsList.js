/* @flow */

import React from "react";

import ResultListItem from "../components/ResultListItem";
import CrisisLineItem from "../components/CrisisLineItem";
import CrisisHeader from "../components/CrisisHeader";

const StaticTextLine = ({object}) => React.cloneElement(object.node);

const className = (elem: {type: {displayName?: string}}) =>
    `resultContainer resultContainer-${
        elem.type.displayName || "other"}`

export function countCrisisResults(results: Array<Object>): number {
    const firstRegularServiceIdx = results.findIndex(
        ({crisis}) => !crisis
    )

    if (firstRegularServiceIdx === -1) {
        // No regular services found; everything is a crisis service
        return results.length
    } else {
        // Anything after the first regular service is not a crisis result
        return firstRegularServiceIdx;
    }
}

class ResultsList extends React.Component {

    crisisResults(): Array<Object> {
        return this.props.results.slice(
            0,
            countCrisisResults(this.props.results)
        )
    }

    nonCrisisResults(): Array<Object> {
        return this.props.results.slice(
            countCrisisResults(this.props.results),
            this.props.results.length
        )
    }

    render(): ReactElement {
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

    renderCrisisResult(object: Object, index: number): ReactElement {
        const elem = object.staticText ?
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

    renderResult(object: Object, index: number): ReactElement {
        const elem = <ResultListItem object={object} />;

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
