import {ReactNode, ComponentType} from "react";
import { slugify } from "underscore.string";
import type { NextRouter } from "next/router";


import type {SearchQueryChanges} from "@/src/iss/searchQueryBuilder.js";
import type {PersonalisationPage} from "@/types/personalisation-page.js"

type Props = {
    name: string;
    byline: string;
    icon: ComponentType | ReactNode;
    searchQueryChanges: SearchQueryChanges
        | ((arg0: NextRouter) => SearchQueryChanges);
    personalisation: Array<PersonalisationPage>;
    dontShowInCategoryList?: boolean;
};

export default class Category {
    key: string;
    name: string;
    byline: string;
    icon: ComponentType | ReactNode;
    searchQueryChanges: SearchQueryChanges
        | ((arg0: NextRouter) => SearchQueryChanges);
    personalisation: Array<PersonalisationPage>;
    dontShowInCategoryList?: boolean;

    constructor(props: Props) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = slugify(this.name);
        this.searchQueryChanges = props.searchQueryChanges;
        this.personalisation = props.personalisation;
        this.dontShowInCategoryList = props.dontShowInCategoryList ?? false;
    }
}
