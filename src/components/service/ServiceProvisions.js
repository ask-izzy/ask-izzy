/* @flow */

import React from "react";

import Collapser from "../general/Collapser";
import { Service } from "../../iss";

type Props = {
    service: Service
}

export default class ServiceProvisions extends React.Component<Props, void> {
    maxAboveFold = 4
    get provisions(): Array<string> {
        return this.props.service?.serviceProvisions || []
    }
    get provisionsAboveFold(): Array<string> {
        return this.provisions.slice(0, this.maxAboveFold)
    }
    get provisionsBelowFold(): Array<string> {
        return this.provisions.slice(this.maxAboveFold)
    }

    render() {
        return this.renderProvisions()
    }

    renderProvisions = () =>
        <ul className="ServiceProvisions">
            {this.provisionsAboveFold.map((provision, i) =>
                <li className="provision aboveFold"
                    key={i}
                >
                    {provision}
                </li>
            )}

            {this.provisionsBelowFold.length > 0 && (
                <Collapser
                    expandMessage={`${this.provisionsBelowFold.length} more…`}
                >
                    {this.provisionsBelowFold.map((provision, i) =>
                        <li className="provision"
                            key={i}
                        >
                            {provision}
                        </li>
                    )}
                </Collapser>
            )}
        </ul>
}
