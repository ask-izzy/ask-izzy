/* @flow */

import { slugify } from "underscore.string";
import type { NextRouter } from "next/router";


import type {SearchQueryChanges} from "../iss/searchQueryBuilder";
import type {PersonalisationPage} from "../../flow/personalisation-page"

export type categoryType = {
    key: string,
    name: string,
    byline: string,
    icon: React$ComponentType<any>,
    searchQueryChanges: SearchQueryChanges | (NextRouter) => SearchQueryChanges,
    personalisation: Array<PersonalisationPage>,
    dontShowInCategoryList: boolean,
}

type Props = {
    name: string,
    byline: string,
    icon: React$ComponentType<any>,
    searchQueryChanges: SearchQueryChanges | (NextRouter) => SearchQueryChanges,
    personalisation: Array<PersonalisationPage>,
    dontShowInCategoryList?: boolean,
}

export default function Category({
    name,
    byline,
    icon,
    searchQueryChanges,
    personalisation,
    dontShowInCategoryList = false,
}: Props): categoryType {
    return ({
        name,
        byline,
        icon,
        key: slugify(name),
        searchQueryChanges,
        personalisation,
        dontShowInCategoryList,
    })

}


