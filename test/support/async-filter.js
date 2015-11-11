/* @flow */

import _ from "underscore";

async function asyncFilter<U>(
    arr: Array<U>, check: (e: U) => Promise<Boolean>
): Promise<Array<U>> {
    let results = arr.map(check);

    results = await Promise.all(results);

    return _.zip(results, arr)
        .filter(elem => elem[0])
        .map(elem => elem[1]);
}

export default asyncFilter;
