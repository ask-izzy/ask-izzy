/* @flow */

import { slugify } from "underscore.string";

import * as iss from "../iss";
import {SortType} from "../components/SortResult.service";

type Props = {
    name: string,
    byline: string,
    icon: React$ComponentType<any>,
    search: iss.searchRequest,
    sortingOptions: Array<SortType>,
    info?: string | React$Element<any>,
    personalisation: Array<any>,
};

export default class Category {
    key: string;
    name: string;
    byline: string;
    icon: React$ComponentType<any>;
    search: iss.searchRequest;
    sortingOptions: Array<SortType>;
    info: ?string|React$Element<any>;
    // I can't get flow to happily check that these are react classes.
    personalisation: Array<any>;

    constructor(props: Props) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = slugify(this.name);
        this.search = {
            catchment: "prefer",
            ...props.search,
        };
        this.sortingOptions = props.sortingOptions;
        this.info = props.info;
        this.personalisation = props.personalisation;
    }
}
