/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import _ from "underscore";

type Props = {
    items: Array<any>,
    search: Object
}

export default class DebugPersonalisation extends React.Component<Props, void> {
    personalisationSteps(): Array<any> {
        let result: Array<Object> = [];
        let request = this.props.search;

        result.push({source: "category", diff: request})

        for (let item of this.props.items) {
            if (typeof item.getSearch === "function") {
                // let the type system find bugs
                const getSearch = (request: Object): ?Object =>
                    item.getSearch(request);

                const nextReq = getSearch(_.clone(request));

                if (!nextReq) {
                    return result;
                }

                result.push({
                    source: item.defaultProps.name,
                    diff: diff(request, nextReq),
                });
                request = nextReq;
            }
        }

        return result;
    }

    render(): ReactElement<"div"> {
        return (
            <div className="DebugPersonalisation">
                <h5>Personalisation debugging</h5>
                <pre>{this.personalisationSteps().map(fmt)}</pre>
            </div>
        );
    }
}

function fmt({source, diff}, idx) {
    return [
        source + "\n",
        JSON.stringify(diff, null, 4) + "\n",
    ];
}

function diff(first: Object, second: Object): Object {
    let added = {};
    let removed = {};
    let changed = {};

    if (!first || !second) {
        return {error: "Could not generate a diff."};
    }

    for (let key of Object.keys(first).concat(Object.keys(second))) {
        if (first.hasOwnProperty(key)) {
            if (second.hasOwnProperty(key)) {
                if (first[key] != second[key]) {
                    changed[key] = {from: first[key], to: second[key]};
                }
            } else {
                removed[key] = first[key];
            }
        } else {
            // Second has it
            added[key] = second[key];
        }
    }

    return {
        changed,
        added,
        removed,
    };
}
