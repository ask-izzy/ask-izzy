/* @flow */

import {Service} from "../iss";
import _ from "lodash"
export type SortType = {
    key: string,
    value: any,
    name: string,
    time: ?string,
}

const DAY_MAPPING = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
}


export const sortResults = (results, orderBy): Array<Service> => {
    const isObject = typeof orderBy.value === "object";
    let newResults = results;
    if (isObject) {
        newResults = results.sort((a, b) => {
            const nestedValue = (val) => {
                const objKeys = Object.keys(orderBy.value)
                const hasVal = Object.keys(val).map(
                    key => (objKeys.includes(key) &&
                        orderBy.value[key] === val[key] && val))
                return hasVal.find(item => item)
            }

            const aVal = isObject && nestedValue(a[orderBy.key])
            const bVal = isObject && nestedValue(b[orderBy.key])
            if (aVal === bVal) {
                return 1
            } else if (aVal !== bVal) {
                return -1
            }
            return 0
        })
    }

    if (!isObject) {
        newResults = _.orderBy(results, (item) => {
            return item[orderBy.key] === orderBy.value;
        }, ["desc"])
    }

    if (orderBy.time) {
        newResults = newResults.sort((a, b) => {
            if (!a.open.nextCloses || !b.open.nextCloses) {
                return 0
            }
            const aTimestamp = a.open.nextCloses.unix();
            const bTimestamp = b.open.nextCloses.unix();
            if (aTimestamp - bTimestamp === 0) {
                return 0
            }
            if (orderBy.time === "open") {
                return (aTimestamp - bTimestamp) < 0 ? 1 : -1
            } else {
                return (aTimestamp - bTimestamp) > 0 ? 1 : -1
            }
        })
    }
    return newResults
}
