/* @flow */

import {Service} from "../../iss";
import _ from "lodash"
export type SortType = {
    key: ?string,
    value?: any,
    name: string,
}

/**
 * This function will receive a list of
 * search results and a sortObject and based off
 * the sort param it will return a newly ordered list
 * @param results - A list of search results
 * @param orderBy - A search term
 * @returns - An ordered list of services
 */
export const sortResults = (
    results: Array<Service>,
    orderBy: SortType,
): Array<Service> => {
    const isObject = typeof orderBy.value === "object";
    let newResults = results;

    // If the param to be sorted is nested
    // within the service object and not on the top level
    if (isObject) {
        const keys = orderBy.value ? Object.keys(orderBy.value) : [];

        // checks if they type is a boolean
        /* $FlowIgnore */
        if (keys.map(item => typeof orderBy.value[item] === "boolean")
            ?.some(val => val)) {

            // Creates two separate lists one that's matched and one
            // that's not then joins them together with matched list first
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
            // Sort through the results
            newResults = results.sort(
                (serviceA: Object, serviceB: Object) => {
                    const nestedValue = (service: Object) => {
                        if (orderBy.value) {
                            const objKeys = Object.keys(orderBy.value);
                            const hasVal = Object.keys(service).map(
                                (key: string) => (objKeys.includes(key) &&
                                    orderBy.value &&
                                    orderBy.value[key] === service[key] &&
                                    service));
                            return hasVal.find(item => item);
                        }
                    }

                    const aVal = isObject && nestedValue(
                        serviceA[orderBy.key]
                    );
                    const bVal = isObject && nestedValue(
                        serviceB[orderBy.key]
                    );
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

    return newResults
}
