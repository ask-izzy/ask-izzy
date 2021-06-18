/* @flow */

import {Service} from "../iss";

export type SortType = {
    key: string,
    value: any,
    name: string,
    time: ?string,
}


export const sortResults = (results, orderBy): Array<Service> => {
    const test = results.sort((a, b) => {
        const isObject = typeof orderBy.value === "object";

        const nestedValue = (val) => {
            const objKeys = Object.keys(orderBy.value)
            const hasVal = Object.keys(val).map(
                key => (objKeys.includes(key) &&
                    orderBy.value[key] === val[key] && val))
            return hasVal.find(item => item)
        }

        const aVal = isObject && nestedValue(a[orderBy.key])
        const bVal = isObject && nestedValue(b[orderBy.key])

        if (isObject) {
            if (aVal === bVal) {
                return 1
            } else if (aVal !== bVal) {
                return -1
            }
        } else {
            console.log(a[orderBy.key] === b[orderBy.key])
            if (
                a[orderBy.key] === b[orderBy.key]
            ) {
                return -1
            } else if (
                a[orderBy.key] !== b[orderBy.key]
            ) {
                return 1
            }
        }
        return 0
    })
    console.log(test)
    return test
}
