/* @flow */
/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import type { LibraryEnglish as YaddaLibraryEnglish } from "yadda"
import Webdriver from "selenium-webdriver";
declare var IzzyStorage: Object;

import dictionary from "../support/dictionary";
/* eslint-disable max-len */
import categories from "../../src/constants/categories";
import WhoIsLookingForHelpDFVPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpDFV";
import WhoIsLookingForHelpAdvocacyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpAdvocacy";
import WhoIsLookingForHelpEverydayNeedsPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpEverydayNeeds";
import WhoIsLookingForHelpFindingWorkPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFindingWork";
import WhoIsLookingForHelpFoodPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFood";
import WhoIsLookingForHelpHealthPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpHealth";
import WhoIsLookingForHelpHousingPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpHousing";
import WhoIsLookingForHelpPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelp";
import WhoIsLookingForHelpMoneyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpMoney";
import WhoIsLookingForHelpSearchPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSearch";
import WhoIsLookingForHelpSupportAndCounsellingPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSupportAndCounselling";
/* eslint-enable max-len */
import SleepTonightPage from
"../../src/constants/personalisation-pages/SleepTonight"
import DemographicsPage from
"../../src/constants/personalisation-pages/Demographics"
import DFVDemographicsPage from
"../../src/constants/personalisation-pages/DfvDemographics"
import DemographicsIndigenousPage from
"../../src/constants/personalisation-pages/DemographicsIndigenous"
import GenderPage from "../../src/constants/personalisation-pages/Gender"
import AgePage from "../../src/constants/personalisation-pages/Age"

module.exports = (Yadda.localisation.English.library(dictionary)
    .given("I have (somewhere|nowhere) to sleep tonight", setSleepTonight)
    .given("I am interested in the \"$STRING\" subcategory for $STRING", setSubcategoryFromStep)
    .given("I am not interested in a subcategory for $STRING", skipSubcategoryFromStep)
    .given("I am not interested in any subcategory", skipAllSubcategoriesFromStep)
    .given(
        "I need help for (myself|a client or customer|a friend or family " +
            "member)",
        setHelpForWhom
    )
    .given("I am not part of any relevant demographics",
        setDemographicsNone
    )
    .given("I am part of the following demographics\n$lines",
        setDemographics
    )
    .given("my gender is (female|male)", setGender)
    .given("I am (17|27|77) years old", setAgeTo): YaddaLibraryEnglish);

// TODO: Question answers should be validated against what the actually answers
// for question pages are so to avoid ugly code duplication here but that's not
// really feasible until we refactor question pages so we can more easily pull
// valid question answers.

async function setSleepTonight(answer: string): Promise<void> {
    await setStorageValue(
        this.driver,
        SleepTonightPage.name,
        ({
            "somewhere": "Yes",
            "nowhere": "No",
        })[answer]
    );
}

async function setHelpForWhom(answer: string): Promise<void> {
    const whoIsLookingForHelpPages = [
        WhoIsLookingForHelpDFVPage,
        WhoIsLookingForHelpAdvocacyPage,
        WhoIsLookingForHelpEverydayNeedsPage,
        WhoIsLookingForHelpFindingWorkPage,
        WhoIsLookingForHelpFoodPage,
        WhoIsLookingForHelpHealthPage,
        WhoIsLookingForHelpHousingPage,
        WhoIsLookingForHelpPage,
        WhoIsLookingForHelpMoneyPage,
        WhoIsLookingForHelpSearchPage,
        WhoIsLookingForHelpSupportAndCounsellingPage,
    ]
    for (const page of whoIsLookingForHelpPages) {
        await setStorageValue(
            this.driver,
            page.name,
            ({
                "myself": "User Myself",
                "a client or customer": "User Worker",
                "a friend or family member": "User Someone Else",
            })[answer]
        );
    }
}

async function setSubcategoryFromStep(
    subcategory: string,
    category: string,
): Promise<void> {
    await setSubcategory(category, subcategory, this.driver);
}

async function setSubcategory(
    category: string,
    subcategory: string,
    driver: typeof Webdriver.WebDriver,
): Promise<void> {
    await setStorageValue(driver, `${category}-subcategory`, subcategory);
}

async function skipSubcategory(
    driver: typeof Webdriver.WebDriver,
    category: string
): Promise<void> {
    return setSubcategory(category, "(skipped)", driver)
}

async function skipSubcategoryFromStep(category: string): Promise<void> {
    return skipSubcategory(this.driver, category)
}

async function skipAllSubcategoriesFromStep(): Promise<void> {
    await Promise.all(
        categories.map(
            category => skipSubcategory(this.driver, category.key)
        )
    )
}

async function setDemographics(
    items: Array<string>,
): Promise<void> {
    await setStorageValue(
        this.driver,
        DemographicsPage.name,
        JSON.stringify(items)
    );
}

async function setDemographicsIndigenous(
    answer: string,
): Promise<void> {
    await setStorageValue(
        this.driver,
        DemographicsIndigenousPage.name,
        answer
    );
}

async function setDFVDemographics(
    answers: Array<string>,
): Promise<void> {
    await setStorageValue(
        this.driver,
        DFVDemographicsPage.name,
        JSON.stringify(answers)
    );
}

async function setDemographicsNone(): Promise<void> {
    await setDemographics.call(this, []);
    await setDemographicsIndigenous.call(this, "(skipped)");
    await setDFVDemographics.call(this, []);
}


async function setAgeTo(age: string): Promise<void> {
    await setStorageValue(
        this.driver,
        AgePage.name,
        ({
            "17": "0 to 17",
            "27": "27 to 39",
            "77": "65 or older",
        })[age]
    );
}

async function setGender(gender: string): Promise<void> {
    await setStorageValue(
        this.driver,
        GenderPage.name,
        ({
            "female": "Female",
            "male": "Male",
        })[gender]
    );
}

async function setStorageValue(
    driver: typeof Webdriver.WebDriver,
    key: string,
    value: string | Array<string>,
): Promise<void> {
    await driver.executeScript(
        (key, value) => {
            if (typeof value === "string") {
                IzzyStorage.setItem(key, value);
            } else {
                IzzyStorage.setJSON(key, value);
            }
        },
        key,
        value
    );
}
