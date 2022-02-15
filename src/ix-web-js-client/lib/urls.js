/* @flow */
export function addSearchParamsToUrl(url: URL, searchParamsObj: Object): void {
    for (const [key, value] of Object.entries(searchParamsObj)) {
        if (Array.isArray(value)) {
            for (const singleValue of value) {
                url.searchParams.append(key, String(singleValue))
            }
        } else {
            url.searchParams.append(key, String(value))
        }
    }
}
