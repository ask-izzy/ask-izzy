/* @flow */
import {useRef} from "react";

export default (): Array<function> => {
    // ref is to fix the stale closure issue
    // caused by updateServices callback
    // fix requires using a ref and a useState hook
    // https://stackoverflow.com/questions/
    // 62806541/how-to-solve-the-react-hook-closure-issue

    const currentList = useRef({})
    const previousList = useRef({})

    const updateCurrent = (newList) => {
        previousList.current = currentList.current
        currentList.current = newList ? newList : {}
    }

    const findRemovedFromPreviousList = () => {
        // returns missing previousList items in currentList
        // if currentList has more items, this differences
        // will not be returned
        const differences = []
        for (let key in previousList.current) {
            if (!Object.keys(currentList.current).includes(key)) {
                differences.push([key, previousList.current[key]])
            }
        }
        return differences
    }
    const getPreviousList = () => {
        // change to this instead of finding the difference
        return previousList.current
    }

    const currentListLengthDifference = () => {
        // returns integer of length differences between
        // currentList and previousList, a positive integer
        // means that currentList is longer than previousList
        return Object.keys(currentList.current).length - Object.keys(previousList.current).length

    }
    return [updateCurrent, findRemovedFromPreviousList, currentListLengthDifference, getPreviousList]
};

