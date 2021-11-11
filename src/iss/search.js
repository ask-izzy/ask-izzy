/* @flow */
import {jsonRequestFromIss} from "./request.js"

export type searchResultsMeta = {
    total_count: number,
    limit: number,
    offset: number,

    previous: ?string,
    next: ?string,
};
export type searchResults = {
    meta: searchResultsMeta,
    objects: Array<Object>,
}

export async function searchIss(
    urlPath: string,
    data: ?{}
): Promise<searchResults> {
    return await (jsonRequestFromIss(urlPath, data): Promise<searchResults>)
}
