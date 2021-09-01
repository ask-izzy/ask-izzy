/* @flow */
import icons from "../icons";

import Category from "./Category"

import personalisation from "../pages/personalisation";

const categories = [
    (new Category({
        slug: "rent-and-tenancy",
        title: "Rent and tenancy help",
        subtitle: "Your rights, rent relief and more",
        icon: icons.Advocacy,
        bannerImage: "housing",
        query: {
            "q": "Tenancy",
        },
        personalisation: [
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        slug: "accommodation",
        title: "A place to stay",
        subtitle: "Housing and accommodation",
        icon: icons.House,
        bannerImage: "centrelink",
        query: {
            "q": "Housing",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
        ],
    }): Category),
    (new Category({
        slug: "money",
        title: "Money help",
        subtitle: "Debt, bills and mortgage help",
        icon: icons.Money,
        bannerImage: "money-help",
        query: {
            "q": "money, hardship",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }): Category),
    (new Category({
        slug: "food-and-everyday-things",
        title: "Food and everyday things",
        subtitle: "Meals, clothing, toiletries, etc.",
        icon: icons.Food,
        bannerImage: "food",
        query: {
            "q": "(material aid), (food), (clothing), (meals), (toiletries)",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }): Category),
    (new Category({
        slug: "mental-health",
        title: "Mental health & wellbeing",
        subtitle: "Counselling and support",
        icon: icons.Health,
        bannerImage: "support-counselling",
        query: {
            "q": "counselling, mental health",
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }): Category),
    (new Category({
        title: "Jobs, training and skills development",
        subtitle: "Finding work, volunteering and training",
        slug: "jobs-and-training",
        icon: icons.Job,
        bannerImage: "finding-work",
        query: {
            q: "employment -(coordinating bodies)",
            service_type: ["employment"],
        },
        personalisation: [
            personalisation.Location,
            personalisation.Age,
        ],
    }): Category),

];

export default categories;

// $FlowIgnore flowjs needs to be updated to include fromEntries
const categoryMap = Object.fromEntries(
    categories.map(category => [category.slug, category])
)

export function getCategory(key: string): ?Category {
    return categoryMap[key]
}
