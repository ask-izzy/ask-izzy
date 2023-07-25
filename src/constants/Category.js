/* @flow */
import type { NextRouter } from "next/router";


import type {SearchQueryChanges} from "../iss/searchQueryBuilder";
import type {PersonalisationPage} from "../../flow/personalisation-page"

type Props = {|
    name: string,
    key: string,
    byline: string,
    icon: React$ComponentType<any>,
    searchQueryChanges: SearchQueryChanges
        | (NextRouter) => SearchQueryChanges,
    personalisation: Array<PersonalisationPage>,
    dontShowInCategoryList?: boolean,
    bannerName: string,
|};

export default class Category {
    key: string;
    name: string;
    byline: string;
    icon: React$ComponentType<any>;
    searchQueryChanges: SearchQueryChanges
        | (NextRouter) => SearchQueryChanges;
    personalisation: Array<PersonalisationPage>;
    dontShowInCategoryList: boolean;
    bannerName: string;

    constructor(props: Props) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = props.key;
        this.searchQueryChanges = props.searchQueryChanges;
        this.personalisation = props.personalisation;
        this.dontShowInCategoryList = props.dontShowInCategoryList ?? false;
        this.bannerName = props.bannerName
    }
}
