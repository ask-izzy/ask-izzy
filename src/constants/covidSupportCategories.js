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
        slug: 'rent-or-tenancy',
        title: 'Rent or tenancy help',
        subtitle: 'Your rights, rent relief and more',
        icon: icons.Advocacy,
        query: {
            "q": "Tenancy"
        }
    }),
    new CovidSupportCategory({
        slug: 'place-to-stay',
        title: '[Not Implemented] Need a place to stay?',
        subtitle: 'Housing and accommodation',
        icon: icons.House,
        query: {
            "catchment": "prefer",
            "q": "housing -(coordinating bodies) -(respite care) -(housing information) -hef -(holiday accommodation)",
            "service_type": [
                "housing"
            ],
            "minimum_should_match": "30%",
            "area": "3000, VIC",
            "client_gender": [
                "x",
                "u"
            ]
        }
    }),
    new CovidSupportCategory({
        slug: 'money',
        title: 'Money help',
        subtitle: 'Debt, bills and motgage help',
        icon: icons.Money,
        query: {
            "q": "Nils"
        }
    }),
    new CovidSupportCategory({
        slug: 'food-and-everyday-things',
        title: '[Not Implemented] Food and everyday things',
        subtitle: 'Meals, clothing, toiletries, etc.',
        icon: icons.Food,
        query: {
            "catchment": "prefer",
            "q": "housing -(coordinating bodies) -(respite care) -(housing information) -hef -(holiday accommodation)",
            "service_type": [
                "housing"
            ],
            "minimum_should_match": "30%",
            "area": "3000, VIC",
            "client_gender": [
                "x",
                "u"
            ]
        }
    }),
];

export default categories;
