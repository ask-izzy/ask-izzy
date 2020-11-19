/* @flow */

import * as React from "react";

import ResultListItem from "../components/ResultListItem";

import type { Service } from "../iss";

class ResultsList
    extends React.Component<{results: Array<Service>}, void> {
    render() {
        return (
            <ul className="ResultsList">
                {this.props.results.map(service =>
                    <li
                        key={service.id.toString()}
                    >
                        <ResultListItem object={service} />
                    </li>
                )}
            </ul>
        );
    }
}

export default ResultsList;
