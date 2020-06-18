/* @flow */


import icons from "../icons";


type Props = {
    slug: string,
    title: string,
    subtitle: string,
    query: string,
    icon: React$ComponentType<any>
}

export class CovidSupportCategory {
    slug: string;
    title: string;
    subtitle: string;
    query: string;
    icon: React$ComponentType<any>;

    constructor(props: Props) {
        this.slug = props.slug
        this.title = props.title
        this.subtitle = props.subtitle
        this.query = props.query
        this.icon = props.icon
    }
}

const categories: Array<Category> = [
    new CovidSupportCategory({
        slug: 'rent-and-tenancy',
        title: 'Rent and tenancy help',
        subtitle: 'Your rights, rent relief and more',
        icon: icons.Advocacy,
        query: {
            "q": "Tenancy"
        }
    }),
    new CovidSupportCategory({
        slug: 'accommodation',
        title: 'A place to stay',
        subtitle: 'Housing and accommodation',
        icon: icons.House,
        query: {
            "q": "Housing",
        }
    }),
    new CovidSupportCategory({
        slug: 'money',
        title: 'Money help',
        subtitle: 'Debt, bills and mortgage help',
        icon: icons.Money,
        query: {
            "q": "money, hardship"
        }
    }),
    new CovidSupportCategory({
        slug: 'food-and-everyday-things',
        title: 'Food and everyday things',
        subtitle: 'Meals, clothing, toiletries, etc.',
        icon: icons.Food,
        query: {
            "q": "(material aid), (food), (clothing), (meals), (toiletries)",
        }
    }),
    new CovidSupportCategory({
        slug: 'mental-health',
        title: 'Mental health & wellbeing',
        subtitle: 'Counselling and support',
        icon: icons.Health,
        query: {
            "q": "counselling, mental health",
        }
    })
];

export default categories;
