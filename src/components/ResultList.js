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
        let elem: ?ReactElement;
        let klass = "other";

        if (object.staticText) {
            elem = React.cloneElement(object.node);
        } else if (object.crisis) {
            elem = (
                <components.CrisisLineItem
                    object={object}
                />
            );
            klass = "CrisisLineItem";
        } else {
            elem = (
                <components.Printable
                    print={<components.ServicePane service={object} />}
                    screen={<components.ResultListItem object={object} />}
                />
            );
            klass = "ResultListItem";
        }

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
