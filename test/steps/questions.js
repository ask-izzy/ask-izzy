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
import { gotoUrl } from "../support/webdriver";
/* eslint-disable max-len */
import WhoIsLookingForHelpDFVPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpDFV";
import WhoIsLookingForHelpAdvocacyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpAdvocacy";
import WhoIsLookingForHelpDrugsAndAlcoholPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpDrugsAndAlcohol";
import WhoIsLookingForHelpEverydayThingsPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpEverydayThings";
import WhoIsLookingForHelpFindingWorkPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFindingWork";
import WhoIsLookingForHelpFoodPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFood";
import WhoIsLookingForHelpHealthPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpHealth";
import WhoIsLookingForHelpHousingPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpHousing";
import WhoIsLookingForHelpPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelp";
import WhoIsLookingForHelpFacilitiesPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFacilities";
import WhoIsLookingForHelpCentrelinkPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpCentrelink";
import WhoIsLookingForHelpLegalPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpLegal";
import WhoIsLookingForHelpLifeSkillsPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpLifeSkills";
import WhoIsLookingForHelpMoneyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpMoney";
import WhoIsLookingForHelpSearchPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSearch";
import WhoIsLookingForHelpSomethingToDoPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSomethingToDo";
import WhoIsLookingForHelpSupportAndCounsellingPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSupportAndCounselling";
import WhoIsLookingForHelpTechnologyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpTechnology";
/* eslint-enable max-len */
import SleepTonightPage from
"../../src/constants/personalisation-pages/SleepTonight"
import DemographicsPage from
"../../src/constants/personalisation-pages/Demographics"
import GenderPage from "../../src/constants/personalisation-pages/Gender"
import AgePage from "../../src/constants/personalisation-pages/Age"

module.exports = (Yadda.localisation.English.library(dictionary)
    .given("I have (somewhere|nowhere) to sleep tonight", setSleepTonight)
    .given("I need nothing for $STRING", setSubcategoryItemsNone)
    .given("I need the following for $STRING\n$lines", setSubcategoryItems)
    .given("I need the following for $STRING: $STRING", setSubcategoryItems)
    .given(
        "I need help for (myself|a client or customer|a friend or family " +
            "member)",
        setHelpForWhom
    )
    .given("I am not part of any relevant demographics",
        setDemographicsNone
    )
    .given("I am not interested in any subcategory", setSubcategoriesNone)
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
        WhoIsLookingForHelpDrugsAndAlcoholPage,
        WhoIsLookingForHelpEverydayThingsPage,
        WhoIsLookingForHelpFindingWorkPage,
        WhoIsLookingForHelpFoodPage,
        WhoIsLookingForHelpHealthPage,
        WhoIsLookingForHelpHousingPage,
        WhoIsLookingForHelpPage,
        WhoIsLookingForHelpFacilitiesPage,
        WhoIsLookingForHelpCentrelinkPage,
        WhoIsLookingForHelpLegalPage,
        WhoIsLookingForHelpLifeSkillsPage,
        WhoIsLookingForHelpMoneyPage,
        WhoIsLookingForHelpSearchPage,
        WhoIsLookingForHelpSomethingToDoPage,
        WhoIsLookingForHelpSupportAndCounsellingPage,
        WhoIsLookingForHelpTechnologyPage,
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

async function setSubcategoryItems(
    category: string,
    items: string | Array<string>,
): Promise<void> {
    await setStorageValue(this.driver, `sub-${category}`, items);
}

async function setSubcategoryItemsNone(category: string): Promise<void> {
    await setSubcategoryItems.call(
        this,
        category,
        "(skipped)"
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

function setDemographicsNone(): Promise<void> {
    return setDemographics.call(this, []);
}

async function setSubcategoriesNone(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/"); // go anywhere to start the session
    await this.driver.executeScript(() => {
        IzzyStorage.setItem("sub-addiction", "(skipped)");
        IzzyStorage.setItem("sub-advocacy", "(skipped)");
        IzzyStorage.setItem("sub-counselling", "(skipped)");
        IzzyStorage.setItem("sub-everyday-things", "(skipped)");
        IzzyStorage.setItem("sub-food", "(skipped)");
        IzzyStorage.setItem("sub-health", "(skipped)");
        IzzyStorage.setItem("sub-housing", "(skipped)");
        IzzyStorage.setItem("sub-indigenous", "(skipped)");
        IzzyStorage.setItem("sub-job", "(skipped)");
        IzzyStorage.setItem("sub-legal", "(skipped)");
        IzzyStorage.setItem("sub-life-skills", "(skipped)");
        IzzyStorage.setItem("sub-money", "(skipped)");
        IzzyStorage.setItem("sub-technology", "(skipped)");
    });
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
