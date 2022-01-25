/* @flow */

import type {
    Element as ReactElement,
    Node as ReactNode
} from "React";
import React from "react";
import _ from "underscore";
import type {SearchQueryModifier} from "../iss/serviceSearch"

type Props = {
    layers: Array<SearchQueryModifier>,
}

export default function DebugPersonalisation({layers}: Props): ReactNode {
    return (
        <div className="DebugPersonalisation">
            <h4>Personalisation debugging</h4>
            {this.personalisationSteps().map((modifier, index) => <>
                <div key={modifier.name + index}>
                    <h5>{modifier.name}</h5>
                    <pre>{JSON.stringify(modifier.changes, null, 2)}</pre>
                </div>
            </>)}
        </div>
    );
}
