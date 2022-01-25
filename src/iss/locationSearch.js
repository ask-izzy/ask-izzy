/* @flow */
import type {searchResultsMeta} from "./search"

export type areaLocation = {
    name: string,
    kind: string,
    postcode: string,
    state: string,
    suburb: string,
}

export type locationSearchRequest = {
    name: string,
    kind: Array<string>,
}

export type locationSearchResults = {
    meta: searchResultsMeta,
    objects: Array<areaLocation>,
}
