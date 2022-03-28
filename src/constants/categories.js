/* @flow */
import icons from "../icons";

import Category from "./Category";

import personalisation from "../pages/personalisation";

const categories = [
    (new Category({
        name: "Food",
        byline: "Something to eat.",
        icon: icons.Food,
        searchQueryChanges: {
            serviceTypes: ["Food"],
        },
        personalisation: [
            personalisation.FoodSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Housing",
        byline: "A place to stay, housing issues.",
        icon: icons.House,
        searchQueryChanges: {
            serviceTypes: ["Housing"],
        },
        personalisation: [
            personalisation.SleepTonight,
            personalisation.HousingSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.Gender,
            personalisation.Age,
            personalisation.Demographics,
            personalisation.HousingAreYouSafe,
            personalisation.OnlineSafetyScreen,
        ],
    }): Category),
    (new Category({
        name: "Everyday needs",
        byline: "Clothes, showers, support and more.",
        icon: icons.Things,
        searchQueryChanges: {
            serviceTypes: [],
        },
        personalisation: [
            personalisation.EverydayThingsSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Money help",
        byline: "Centrelink, emergency funds, loans and more.",
        icon: icons.Money,
        searchQueryChanges: {
            serviceTypes: ["Finance"],
        },
        personalisation: [
            personalisation.MoneySubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Health",
        byline: "Doctors, clinics, specialists.",
        icon: icons.Health,
        searchQueryChanges: {
            serviceTypes: [],
        },
        personalisation: [
            personalisation.HealthSubcategories,
            personalisation.HealthAreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DemographicsIndigenous,
        ],
    }): Category),
    (new Category({
        name: "Domestic and family violence help",
        byline:
            "Feeling unsafe, experiencing violence or abuse from a partner " +
            "or family member.",
        icon: icons.EscapeViolence,
        searchQueryChanges: {
            serviceTypes: [],
        },
        personalisation: [
            personalisation.AreYouSafe,
            personalisation.OnlineSafetyScreen,
            personalisation.DVFSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
            personalisation.DfvDemographics,
            personalisation.Under18DomesticViolenceScreen,
            personalisation.UsingViolenceScreen,
            personalisation.LgbtiqaDomesticViolenceScreen,
        ],
    }): Category),
    (new Category({
        name: "Advice and advocacy",
        byline: "Legal issues, fines, representation.",
        icon: icons.Advocacy,
        searchQueryChanges: {
            serviceTypes: [],
        },
        personalisation: [
            personalisation.AdvocacySubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
    (new Category({
        name: "Work and learning",
        byline: "Jobs, education and skills.",
        icon: icons.Job,
        searchQueryChanges: {
            serviceTypes: [],
        },
        personalisation: [
            personalisation.JobSubcategories,
            personalisation.WhoIsLookingForHelp,
            personalisation.Location,
        ],
    }): Category),
];

export default categories;

// $FlowIgnore flowjs needs to be updated to include fromEntries
const categoryMap = Object.fromEntries(
    categories.map(category => [category.key, category])
)

export function getCategory(key: string): ?Category {
    return categoryMap[key];
}
