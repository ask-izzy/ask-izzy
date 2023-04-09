/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import Yadda from "yadda";

import dictionary from "../support/dictionary.js";
import { gotoUrl } from "../support/webdriver.js";


import WhoIsLookingForHelpDFVPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpDFV.js";
import WhoIsLookingForHelpAdvocacyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpAdvocacy.js";
import WhoIsLookingForHelpDrugsAndAlcoholPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpDrugsAndAlcohol.js";
import WhoIsLookingForHelpEverydayThingsPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpEverydayThings.js";
import WhoIsLookingForHelpFindingWorkPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFindingWork.js";
import WhoIsLookingForHelpFoodPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFood.js";
import WhoIsLookingForHelpHealthPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpHealth.js";
import WhoIsLookingForHelpHousingPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpHousing.js";
import WhoIsLookingForHelpPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelp.js";
import WhoIsLookingForHelpFacilitiesPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpFacilities.js";
import WhoIsLookingForHelpCentrelinkPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpCentrelink.js";
import WhoIsLookingForHelpLegalPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpLegal.js";
import WhoIsLookingForHelpLifeSkillsPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpLifeSkills.js";
import WhoIsLookingForHelpMoneyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpMoney.js";
import WhoIsLookingForHelpSearchPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSearch.js";
import WhoIsLookingForHelpSomethingToDoPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSomethingToDo.js";
import WhoIsLookingForHelpSupportAndCounsellingPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpSupportAndCounselling.js";
import WhoIsLookingForHelpTechnologyPage from "../../src/constants/personalisation-pages/WhoIsLookingForHelpTechnology.js";
import SleepTonightPage from "../../src/constants/personalisation-pages/SleepTonight.js"
import DemographicsPage from "../../src/constants/personalisation-pages/Demographics.js"
import GenderPage from "../../src/constants/personalisation-pages/Gender.js"
import AgePage from "../../src/constants/personalisation-pages/Age.js"


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
    .given("I am (17|27|77) years old", setAgeTo));

// TODO: Question answers should be validated against what the actually answers
// for question pages are so to avoid ugly code duplication here but that's not
// really feasible until we refactor question pages so we can more easily pull
// valid question answers.

async function setSleepTonight(answer) {
    await setStorageValue(
        this.driver,
        SleepTonightPage.name,
        ({
            "somewhere": "Yes",
            "nowhere": "No",
        })[answer]
    );
}

async function setHelpForWhom(answer) {
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
    category,
    items,
) {
    await setStorageValue(this.driver, `sub-${category}`, items);
}

async function setSubcategoryItemsNone(category) {
    await setSubcategoryItems.call(
        this,
        category,
        "(skipped)"
    )
}

async function setDemographics(
    items,
) {
    await setStorageValue(
        this.driver,
        DemographicsPage.name,
        JSON.stringify(items)
    );
}

function setDemographicsNone() {
    return setDemographics.call(this, []);
}

async function setSubcategoriesNone() {
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

async function setAgeTo(age) {
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

async function setGender(gender) {
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
    driver,
    key,
    value,
) {
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
