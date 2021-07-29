/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

import Collapser from "../general/Collapser";
import { Service } from "../../iss";

type Props = {
    service: Service
}

export default class ServiceProvisions extends React.Component<Props, void> {
    maxAboveFold: number = 4
    get provisions(): Array<string> {
        return this.props.service?.serviceProvisions || []
    }
    get provisionsAboveFold(): Array<string> {
        return this.provisions.slice(0, this.maxAboveFold)
    }
    get provisionsBelowFold(): Array<string> {
        return this.provisions.slice(this.maxAboveFold)
    }

    render(): ReactElement<"ul"> {
        return this.renderProvisions()
    }

    renderProvisions: (() => ReactElement<"ul">) = () =>
        <ul className="ServiceProvisions">
            {this.provisionsAboveFold.map((provision, i) =>
                <li className="provision aboveFold"
                    aria-label={`${provision}.`}
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
                            aria-label={`${provision}.`}
                            key={i}
                        >
                            {provision}
                        </li>
                    )}
                </Collapser>
            )}
        </ul>
}
