/* @flow */

import { slugify } from "underscore.string";


import type {serviceSearchRequest} from "../iss/serviceSearch";
import type {SearchQueryChanges} from "../iss/searchQueryBuilder";
import type {PersonalisationPage} from "../utils/personalisation"
import {
    modifySearchQuery,
} from "../iss/searchQueryBuilder"
import {
    convertIzzySearchQueryToIss3,
} from "../iss/serviceSearch"

type Props = {
    name: string,
    byline: string,
    icon: React$ComponentType<any>,
    searchQueryChanges: SearchQueryChanges,
    info?: string | React$Element<any>,
    personalisation: Array<PersonalisationPage>,
};

export default class Category {
    key: string;
    name: string;
    byline: string;
    icon: React$ComponentType<any>;
    searchQueryChanges: SearchQueryChanges;
    info: ?string|React$Element<any>;
    // I can't get flow to happily check that these are react classes.
    personalisation: Array<any>;

    constructor(props: Props) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = slugify(this.name);
        this.searchQueryChanges = props.searchQueryChanges;
        this.info = props.info;
        this.personalisation = props.personalisation;
    }

    get search(): serviceSearchRequest {
        return convertIzzySearchQueryToIss3(
            modifySearchQuery({}, this.searchQueryChanges)
        );
    }
}
