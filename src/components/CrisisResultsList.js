/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "react";

import CrisisLineItem from "../components/CrisisLineItem";
import type { Service } from "../iss";

class CrisisResultsList extends React.Component<{
    results: Array<Service>
}, void> {
    render: () => ReactNode = () => (
        <div className="CrisisResultsList">
            <h3>
                Crisis hotlines
            </h3>
            <h4>
                For help and safety call:
            </h4>
            <ul>
                {this.props.results.map((service, i) =>
                    <li
                        key={service.id.toString()}
                    >
                        <CrisisLineItem
                            object={service}
                            resultNumber={i + 1}
                        />
                    </li>
                )}
            </ul>
        </div>
    );

}

export default CrisisResultsList;
