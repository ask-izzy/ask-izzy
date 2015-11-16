/* @flow */

import React from "react";

import components from "../components";

class ResultsList extends React.Component {

    render(): ReactElement {
        return (
            <div className="ResultList">
                {this.props.results.map(this.renderResult.bind(this))}
            </div>
        );
    }

    renderResult(object: Object, index: number): ReactElement {
        const elem = object.staticText ?
            React.cloneElement(object.node)
        : object.crisis ?
            <components.CrisisLineItem
                object={object}
            />
        : <components.ResultListItem
            object={object}
          />;

        const klass = elem.type.displayName || "other";

        return (
            <div
                key={index}
                className={
                    `resultContainer resultContainer-${klass}`
                }
            >
                {elem}
            </div>
        );
    }
}

export default ResultsList;
