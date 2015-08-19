/* @flow */
import icons from "../icons";

class Category {
    key: string;
    name: string;
    byline: string;
    icon: ReactComponent;
    search: string;

    constructor(props: {
        name: string,
        byline: string,
        icon: ReactComponent,
        search: string
    }) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = this.name
            .replace(' ', '-')
            .replace('&', '-and-')
            .toLowerCase();
        this.search = props.search;
    }
}

var categories:Array<Category> = [
    new Category({
        name: "Housing",
        byline: "Find a place to stay",
        icon: icons.House,
        search: 'housing',
    }),
    new Category({
        name: "Food",
        byline: "Find something to eat",
        icon: icons.Food,
        search: 'food',
    }),
    new Category({
        name: "Everyday things",
        byline: "Things you might need",
        icon: icons.Things,
        search: 'recreation',
    }),
    new Category({
        name: "Legal",
        byline: "Help with law, police & transport officers",
        icon: icons.Legal,
        search: 'legal aid',
    }),
    new Category({
        name: "Money Help",
        byline: "Help with emergency funds, loans, bills or budgeting",
        icon: icons.Money,
        search: 'financial aid',
    }),
    new Category({
        name: "Health",
        byline: "Physical, mental & emotional health",
        icon: icons.Health,
        search: 'physical health',
    }),
    new Category({
        name: "Addiction",
        byline:
        "Help dealing with drugs & alcohol, harm minimisation, gambling etc.",
        icon: icons.Addiction,
        search: 'additional',
    }),
    new Category({
        name: "Support & counselling",
        byline: "Someone to help & talk to",
        icon: icons.Mental,
        search: 'mental health',
    }),
    new Category({
        name: "Life skills & education",
        byline: "Developing everyday living skills etc.",
        icon: icons.Skills,
        search: 'life skills',
    }),
    new Category({
        name: "Finding work",
        byline: "Making money or volunteering",
        icon: icons.Job,
        search: 'employment',
    }),
    new Category({
        name: "Centrelink",
        byline: "Find Centrelink near you",
        icon: icons.Centrelink,
        search: 'centrelink',
    }),
    new Category({
        name: "Something to do",
        byline: "Meet people, try an activity or just hang out",
        icon: icons.Entertainment,
        search: 'recreation',
    }),
    new Category({
        name: "Facilities",
        byline: "Public toilets, libraries, etc.",
        icon: icons.Facilaties,
        search: 'facilities',
    }),
    new Category({
        name: "Technology",
        byline: "Computers, mobiles, free wifi or charging",
        icon: icons.Tech,
        search: 'technology',
    }),
];

export default categories;
