/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";

import ResultListItem from "../components/ResultListItem";
import type { Service } from "../iss";

class ResultsList
    extends React.Component<{results: Array<Service>}, void> {
    render(): ReactNode {
        return (
            <ul className="ResultsList">
                {this.props.results.map((service, index) =>
                    <li
                        key={service.id.toString()}
                    >
                        <ResultListItem
                            service={service}
                            resultNumber={index + 1}
                        />
                    </li>
                )}
            </ul>
        );
    }
}

export default ResultsList;
