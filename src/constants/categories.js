/* @flow */
import React from "react"
import type { NextRouter } from "next/router";

import icons from "../icons";

import Category from "./Category";

/* eslint-disable max-len */
import AdvocacySubcategories from "@/src/constants/personalisation-pages/AdvocacySubcategories";
import Age from "@/src/constants/personalisation-pages/Age";
import AreYouSafe from "@/src/constants/personalisation-pages/AreYouSafe";
import CounsellingAreYouSafe from "@/src/constants/personalisation-pages/CounsellingAreYouSafe";
import CounsellingSubcategories from "@/src/constants/personalisation-pages/CounsellingSubcategories";
import DemographicsIndigenous from "@/src/constants/personalisation-pages/DemographicsIndigenous";
import Demographics from "@/src/constants/personalisation-pages/Demographics";
import DfvDemographics from "@/src/constants/personalisation-pages/DfvDemographics";
import DFVSubcategories from "@/src/constants/personalisation-pages/DFVSubcategories";
import EverydayNeedsSubcategories from "@/src/constants/personalisation-pages/EverydayNeedsSubcategories";
import FoodSubcategories from "@/src/constants/personalisation-pages/FoodSubcategories";
import FreeTextAreYouSafe from "@/src/constants/personalisation-pages/FreeTextAreYouSafe";
import Gender from "@/src/constants/personalisation-pages/Gender";
import HealthSubcategories from "@/src/constants/personalisation-pages/HealthSubcategories";
import HousingSubcategories from "@/src/constants/personalisation-pages/HousingSubcategories";
import HousingAreYouSafe from "@/src/constants/personalisation-pages/HousingAreYouSafe";
import JobSubcategories from "@/src/constants/personalisation-pages/JobSubcategories";
import LgbtiqaDomesticViolenceScreen from "@/src/constants/personalisation-pages/LgbtiqaDomesticViolenceScreen";
import Location from "@/src/constants/personalisation-pages/Location";
import MoneySubcategories from "@/src/constants/personalisation-pages/MoneySubcategories";
import OnlineSafetyScreen from "@/src/constants/personalisation-pages/OnlineSafetyScreen";
import SleepTonight from "@/src/constants/personalisation-pages/SleepTonight";
import Under18DomesticViolenceScreen from "@/src/constants/personalisation-pages/Under18DomesticViolenceScreen";
import UsingViolenceScreen from "@/src/constants/personalisation-pages/UsingViolenceScreen";
import WhoIsLookingForHelpDFV from "@/src/constants/personalisation-pages/WhoIsLookingForHelpDFV";
import WhoIsLookingForHelpAdvocacy from "@/src/constants/personalisation-pages/WhoIsLookingForHelpAdvocacy";
import WhoIsLookingForHelpEverydayNeeds from "@/src/constants/personalisation-pages/WhoIsLookingForHelpEverydayNeeds";
import WhoIsLookingForHelpFindingWork from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFindingWork";
import WhoIsLookingForHelpFood from "@/src/constants/personalisation-pages/WhoIsLookingForHelpFood";
import WhoIsLookingForHelpHealth from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHealth";
import WhoIsLookingForHelpHousing from "@/src/constants/personalisation-pages/WhoIsLookingForHelpHousing";
import WhoIsLookingForHelpMoney from "@/src/constants/personalisation-pages/WhoIsLookingForHelpMoney";
import WhoIsLookingForHelpSearch from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSearch";
import WhoIsLookingForHelpSupportAndCounselling from "@/src/constants/personalisation-pages/WhoIsLookingForHelpSupportAndCounselling";
/* eslint-enable max-len */

const categories = [
    (new Category({
        name: "Food",
        key: "food",
        byline: "Something to eat",
        icon: icons.Food,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "meals",
                    "-\"coordinating bodies\"",
                    "-\"home care\"",
                    "-\"food safety\"",
                    "-\"meals on wheels\"",
                    "-\"assistance with meals\"",
                    "-\"hire of facilities\"",
                    "-chsp",
                    "-\"meal preparation\"",
                ],
                serviceTypes: ["Food"],
            },
        },
        personalisation: [
            FoodSubcategories,
            WhoIsLookingForHelpFood,
            Location,
        ],
        bannerName: "hand-and-person-with-heart",
    }): Category),
    (new Category({
        name: "Housing",
        key: "housing",
        byline: "A place to stay, housing issues",
        icon: icons.House,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "housing",
                    "-\"coordinating bodies\"",
                    "-\"respite care\"",
                    "-\"housing information\"",
                    "-hef",
                    "-\"holiday accommodation\"",
                ],
                serviceTypes: ["Housing"],
            },
        },
        personalisation: [
            SleepTonight,
            HousingSubcategories,
            WhoIsLookingForHelpHousing,
            Location,
            Gender,
            Age,
            Demographics,
            HousingAreYouSafe,
            OnlineSafetyScreen,
        ],
        bannerName: "hands-and-house",
    }): Category),
    (new Category({
        name: "Money help",
        key: "money-help",
        byline: "Centrelink, emergency funds, loans and more",
        icon: icons.Money,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "financial",
                    "aid",
                    "-\"coordinating bodies\"",
                    "-grants",
                    "-heritage",
                ],
                serviceTypes: ["Finance", "Financial Aid"],
            },
        },
        personalisation: [
            MoneySubcategories,
            WhoIsLookingForHelpMoney,
            Location,
        ],
        bannerName: "buildings-and-shapes",
    }): Category),
    (new Category({
        name: "Support and counselling",
        key: "support-and-counselling",
        byline: "Mental health, relationships, addiction",
        icon: icons.Support,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: ["counselling"],
                serviceTypes: [
                    "Counselling",
                ],
            },
            minimumShouldMatch: "1",
        },
        personalisation: [
            CounsellingSubcategories,
            CounsellingAreYouSafe,
            OnlineSafetyScreen,
            WhoIsLookingForHelpSupportAndCounselling,
            Location,
            DemographicsIndigenous,
        ],
        bannerName: "hands-and-person-with-heart",
    }): Category),
    (new Category({
        name: "Domestic and family violence help",
        key: "dfv-help",
        byline:
            "Feeling unsafe, experiencing violence or abuse from a partner " +
            "or family member",
        icon: icons.EscapeViolence,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "\"family violence\"",
                    "-\"coordinating bodies\"",
                    "-\"fire-fighting\"",
                ],
            },
        },
        personalisation: [
            AreYouSafe,
            OnlineSafetyScreen,
            DFVSubcategories,
            WhoIsLookingForHelpDFV,
            Location,
            DfvDemographics,
            Under18DomesticViolenceScreen,
            UsingViolenceScreen,
            LgbtiqaDomesticViolenceScreen,
        ],
        bannerName: "hands-and-heart",
    }): Category),
    (new Category({
        name: "Everyday needs",
        key: "everyday-needs",
        byline: "Clothes, showers, support and more",
        icon: icons.Things,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "material",
                    "aid",
                    "-\"coordinating bodies\"",
                ],
                serviceTypes: ["Material Aid"],
            },
        },
        personalisation: [
            EverydayNeedsSubcategories,
            WhoIsLookingForHelpEverydayNeeds,
            Location,
        ],
        bannerName: "hands-and-person-and-square",
    }): Category),
    (new Category({
        name: "Health",
        key: "health",
        byline: "Doctors, clinics, specialists",
        icon: icons.Health,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "-\"coordinating bodies\"",
                    "assistance pets",
                    "-\"animal control\"",
                    "-effectiveness",
                ],
                serviceTypes: [
                    "Medical",
                    "Health Care Services",
                    "Health Professionals/ Practitioners",
                ],
            },
            minimumShouldMatch: "30%",
            showInAskIzzyHealth: true,
        },
        personalisation: [
            HealthSubcategories,
            WhoIsLookingForHelpHealth,
            Location,
            DemographicsIndigenous,
        ],
        bannerName: "hand-and-heart",
    }): Category),
    (new Category({
        name: "Advice and advocacy",
        key: "advice-and-advocacy",
        byline: "Legal issues, fines, representation",
        icon: icons.Advocacy,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "advice",
                    "advocacy",
                    "-research",
                    "-\"coordinating bodies\"",
                ],
                serviceTypes: [
                    "Advocacy",
                    "Law",
                ],
            },
        },
        personalisation: [
            AdvocacySubcategories,
            WhoIsLookingForHelpAdvocacy,
            Location,
            DemographicsIndigenous,
        ],
        bannerName: "hand-and-building-and-person",
    }): Category),
    (new Category({
        name: "Work and learning",
        key: "work-and-learning",
        byline: "Jobs, education and skills",
        icon: icons.Job,
        searchQueryChanges: {
            catchment: "prefer",
            $concat: {
                term: [
                    "employment",
                    "education",
                    "-\"coordinating bodies\"",
                    "-chsp",
                    "-hacc",
                ],
                serviceTypes: ["Employment", "Education"],
            },
        },
        personalisation: [
            JobSubcategories,
            WhoIsLookingForHelpFindingWork,
            Location,
            DemographicsIndigenous,
        ],
        bannerName: "buildings-and-hand",
    }): Category),
    (new Category({
        name: "Search",
        key: "search",
        byline: "Free text search",
        icon: () => <icons.Search viewBox="14 14 35 35" />,
        searchQueryChanges(router: NextRouter) {
            const searchTerm = decodeURIComponent(router.query.search)

            const [isDAFSearch, DAFSearchTerm] = searchTerm.match(/^Disability Advocacy Providers(?: - )?(.*)/) || []

            // A special case for the "Find advocacy" button on the
            // DisabilityAdvocacyFinder page.
            if (isDAFSearch) {
                return {
                    term: [DAFSearchTerm || "disability"],
                    $push: {
                        serviceTypesRaw: "disability advocacy",
                    },
                }
            }

            return {
                $push: {
                    term: searchTerm,
                },
            }
        },
        personalisation: [
            FreeTextAreYouSafe,
            OnlineSafetyScreen,
            WhoIsLookingForHelpSearch,
            Location,
        ],
        dontShowInCategoryList: true,
        bannerName: "hand-and-person-with-heart",
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
