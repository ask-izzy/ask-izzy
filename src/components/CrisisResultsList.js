/* @flow */

import * as React from "react";

import CrisisLineItem from "../components/CrisisLineItem";


import type { Service } from "../iss";

class CrisisResultsList extends React.Component<{
    results: Array<Service>
}, void> {
    render = () => (
        <div className="CrisisResultsList">
            <h3>
                Crisis hotlines
            </h3>
            <h4>
                For help and safety call:
            </h4>
            <ul>
                {this.props.results.map(service =>
                    <li
                        key={service.id.toString()}
                    >
                        <CrisisLineItem object={service} />
                    </li>
                )}
            </ul>
        </div>
    );

}

export default CrisisResultsList;
