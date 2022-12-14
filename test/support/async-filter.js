async function asyncFilter(
    arr,
    check
) {
    let results = arr.map(check);

    results = await Promise.all(results);

    return arr
        .filter((elm, index) => results[index])
}

export default asyncFilter;
