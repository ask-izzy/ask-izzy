/* @flow */

import React from "react";
import _ from "underscore";

export default class DebugPersonalisation extends React.Component {
    props: {items: Array<any>, search: Object};
    state: void;

    personalisationSteps() {
        let result: Array<Object> = [];
        let request = this.props.search;

        result.push({source: "category", diff: _.clone(request)})

        for (let item of this.props.items) {
            if (typeof item.getSearch == "function") {
                const nextReq = item.getSearch(request);

                result.push({source: item.name, diff: diff(request, nextReq)})
                request = nextReq;
            }
        }

        return result;
    }

    render() {
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
