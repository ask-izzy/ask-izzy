/* @flow */

import {Service} from "../iss";
import _ from "lodash"
export type SortType = {
    key: ?string,
    value?: any,
    name: string,
    time?: ?string,
}


export const sortResults = (
    results: Array<Service>,
    orderBy: SortType,
): Array<Service> => {
    const isObject = typeof orderBy.value === "object";
    let newResults = results;
    if (isObject) {
        const keys = orderBy.value ? Object.keys(orderBy.value) : [];
        /* $FlowIgnore */
        if (keys.map(item => typeof orderBy.value[item] === "boolean").length) {
            for (let key = 0; key < keys.length; key++) {
                const matchedResults = results.filter(item =>
                    /* $FlowIgnore */
                    orderBy.key && item[orderBy.key][keys[key]]
                )
                const unMatchedResults = results.filter(item =>
                    orderBy.key &&
                    /* $FlowIgnore */
                    !item[orderBy.key][keys[key]]
                )
                newResults = matchedResults.concat(unMatchedResults)
            }
        } else {
            newResults = results.sort((a: Object, b: Object) => {
                const nestedValue = (val: Object) => {
                    if (orderBy.value) {
                        const objKeys = Object.keys(orderBy.value);
                        const hasVal = Object.keys(val).map(
                            (key: string) => (objKeys.includes(key) &&
                                orderBy.value &&
                                orderBy.value[key] === val[key] && val));
                        return hasVal.find(item => item);
                    }
                }

                const aVal = isObject && nestedValue(a[orderBy.key]);
                const bVal = isObject && nestedValue(b[orderBy.key]);
                if (aVal === bVal) {
                    return 1;
                } else if (aVal !== bVal) {
                    return -1;
                }
                return 0;
            })
        }
    }

    if (!isObject) {
        if (typeof orderBy.value === "boolean") {
            const matchedResults = results.filter(item =>
                /* $FlowIgnore */
                orderBy.key && item[orderBy.key]
            )
            const UnMatchedResults = results.filter(item =>
                /* $FlowIgnore */
                orderBy.key && !item[orderBy.key]
            )
            newResults = matchedResults.concat(UnMatchedResults)
        } else {
            newResults = _.orderBy(results, (item) => {
                return orderBy.key && item[orderBy.key] === orderBy.value;
            }, ["desc"])
        }
    }

    if (orderBy.time) {
        newResults = newResults.sort((a, b) => {
            if (!a.open.nextCloses || !b.open.nextCloses) {
                return 0;
            }
            const aTimestamp = a.open.nextCloses?.unix();
            const bTimestamp = b.open.nextCloses?.unix();

            if (!aTimestamp || !bTimestamp) {
                return 0;
            }
            if (aTimestamp - bTimestamp === 0) {
                return 0;
            }

            if (orderBy.time === "open") {
                return (aTimestamp - bTimestamp) < 0 ? 1 : -1;
            } else {
                return (aTimestamp - bTimestamp) > 0 ? 1 : -1;
            }
        })
    }
    return newResults
}
