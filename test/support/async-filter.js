/* @flow */

async function asyncFilter<U>(
    arr: Array<U>,
    check: (e: U) => Promise<Boolean>
): Promise<Array<U>> {
    let results = arr.map(check);

    results = await Promise.all(results);

    return arr
        .filter((elm, index) => results[index])
}

export default asyncFilter;
