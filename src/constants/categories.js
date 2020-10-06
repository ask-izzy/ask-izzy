/* @flow */

import { slugify } from "underscore.string";

import icons from "../icons";
import * as iss from "../iss";

import personalisation from "../pages/personalisation";

type Props = {
    slug?: string,
    title: string,
    subtitle: string,
    query: Object,
    icon: React$ComponentType<any>,
    bannerImage?: string,
    personalisation: Array<any>,
};

export class Category {
    slug: string;
    title: string;
    subtitle: string;
    query: Object;
    icon: React$ComponentType<any>;
    bannerImage: ?string;

    key: string;
    name: ?string;
    byline: ?string;
    icon: React$ComponentType<any>;
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
        this.key = this.slug || this.slug;
        this.search = {
            catchment: "prefer",
            ...(props.query || props.search),
        };
        this.personalisation = props.personalisation;
    }
}

const categories: Array<Category> = [
    new Category({
        slug: "rent-and-tenancy",
        title: "Rent and tenancy help",
        subtitle: "Your rights, rent relief and more",
        icon: icons.Advocacy,
        bannerImage: 'housing',
        query: {
            "q": "Tenancy",
        },
        personalisation: [
            personalisation.Location
        ],
    }),
    new Category({
        slug: "accommodation",
        title: "A place to stay",
        subtitle: "Housing and accommodation",
        icon: icons.House,
        bannerImage: 'centrelink',
        query: {
            "q": "Housing",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
        ],
    }),
    new Category({
        slug: "money",
        title: "Money help",
        subtitle: "Debt, bills and mortgage help",
        icon: icons.Money,
        bannerImage: 'money-help',
        query: {
            "q": "money, hardship",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }),
    new Category({
        slug: "food-and-everyday-things",
        title: "Food and everyday things",
        subtitle: "Meals, clothing, toiletries, etc.",
        icon: icons.Food,
        bannerImage: 'food',
        query: {
            "q": "(material aid), (food), (clothing), (meals), (toiletries)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }),
    new Category({
        slug: "mental-health",
        title: "Mental health & wellbeing",
        subtitle: "Counselling and support",
        icon: icons.Health,
        bannerImage: 'support-counselling',
        query: {
            "q": "counselling, mental health",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }),
    new Category({
        title: "Jobs and training",
        subtitle: "words go here",
        slug: "jobs-and-training",
        icon: icons.Job,
        bannerImage: 'finding-work',
        query: {
            q: "employment -(coordinating bodies)",
            service_type: ["employment"],
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }),

];

export default categories;
