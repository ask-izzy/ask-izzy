/* @flow */
import icons from "../icons";

class Category {
    key: string;
    name: string;
    byline: string;
    icon: ReactComponent;

    constructor(props: {name:string, byline:string, icon: ReactComponent}) {
        this.name = props.name;
        this.byline = props.byline;
        this.icon = props.icon;
        this.key = this.name
            .replace(' ', '-')
            .replace('&', '-and-')
            .toLowerCase();
    }
}

var categories:Array<Category> = [
    new Category({
        name: "Housing",
        byline: "Find a place to stay",
        icon: icons.House,
    }),    new Category({
        name: "Food",
        byline: "Find something to eat",
        icon: icons.Food,
    }),
    new Category({
        name: "Everyday things",
        byline: "Things you might need",
        icon: icons.Things,
    }),
    new Category({
        name: "Legal",
        byline: "Help with law, police and transport officers",
        icon: icons.Legal,
    }),
    new Category({
        name: "Money Help",
        byline: "Help with emergency funds, loans, bills or budgeting",
        icon: icons.Money,
    }),
    new Category({
        name: "Health",
        byline: "Physical, mental & emotional health",
        icon: icons.Health,
    }),
    new Category({
        name: "Addiction",
        byline:
        "Help dealing with drugs & alcohol, harm minimisation, gambling etc",
        icon: icons.Addiction,
    }),
    new Category({
        name: "Support and counselling",
        byline: "Someone to help and talk to",
        icon: icons.Mental,
    }),
    new Category({
        name: "Life skills & education",
        byline: "Developing everyday living skills and more",
        icon: icons.Skills,
    }),
    new Category({
        name: "Finding work",
        byline: "Making money or volunteering",
        icon: icons.Job,
    }),
    new Category({
        name: "Centrelink",
        byline: "Find Centerlink near you",
        icon: icons.Centerlink,
    }),
    new Category({
        name: "Something to do",
        byline: "Meet people, try an activity or just hang out",
        icon: icons.Entertainment,
    }),
    new Category({
        name: "Facilities",
        byline: "Public toilets, libraries, etc",
        icon: icons.Facilaties,
    }),
    new Category({
        name: "Technology",
        byline: "Computers, mobiles, free wifi or charging",
        icon: icons.Tech,
    }),
];

export default categories;
