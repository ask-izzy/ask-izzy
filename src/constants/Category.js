/* @flow */

import { slugify } from "underscore.string";

import * as iss from "../iss";

type Props = {
    slug?: string,
    title: string,
    subtitle: string,
    query: Object,
    icon: React$ComponentType<any>,
    bannerImage?: string,
    personalisation: Array<any>,
};

export default class Category {
    slug: string;
    title: string;
    subtitle: string;
    query: Object;
    icon: React$ComponentType<any>;
    bannerImage: ?string;

    key: string;
    name: ?string;
    byline: ?string;
    search: iss.searchRequest;
    info: ?string|React$Element<any>;
    // I can't get flow to happily check that these are react classes.
    personalisation: Array<any>;

    constructor(props: Props) {
        this.slug = props.slug || slugify(props.title)
        this.title = props.title
        this.subtitle = props.subtitle
        this.query = props.query
        this.icon = props.icon
        this.bannerImage = props.bannerImage

        this.name = this.title;
        this.byline = this.subtitle;
        this.icon = props.icon;
        this.key = this.slug;
        this.search = props.query;
        this.personalisation = props.personalisation;
    }
}