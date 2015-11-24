/* @flow */
/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import { titleize } from "underscore.string";
import _ from "underscore";
import Webdriver from "selenium-webdriver";

declare var IzzyStorage: Object;

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from "../support/webdriver";

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given("I have (somewhere|nowhere) to sleep tonight",
               unpromisify(setSleepTonight))
        .given("I need nothing for $STRING",
               unpromisify(setSubcategoryItemsNone))
        .given("I need the following for $STRING\n$lines",
               unpromisify(setSubcategoryItems))
        .given("I need the following for $STRING: $string",
               unpromisify(setSubcategoryItem))
        .given("I am not part of any relevant demographics",
               unpromisify(setDemographicsNone))
        .given("I am not interested in any subcategory",
               unpromisify(setSubcategoriesNone))
        .given("I am part of the following demographics\n$lines",
               unpromisify(setDemographics))
        .given("my gender is $STRING", unpromisify(setGender))
        .given("I am 17 years old",
               unpromisify(_.partial(setAgeTo, "25 or younger")))
        .given("I am 27 years old",
               unpromisify(_.partial(setAgeTo, "26 to 64")))
        .given("I am 77 years old",
               unpromisify(_.partial(setAgeTo, "65 or older")))
        ;
})();

async function setSleepTonight(answer: string): Promise<void> {
    if (answer == "somewhere") {
        answer = "Yes";
    } else if (answer == "nowhere") {
        answer = "No";
    } else {
        throw new Error("Unexpected");
    }

    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(answer => {
        IzzyStorage.setItem("sleep-tonight", answer);
    }, answer);
}

async function setStorageValue(
    driver: Webdriver.WebDriver,
    key: string,
    value: string,
): Promise<void> {
    await gotoUrl(driver, "/");  // go anywhere to start the session
    await driver.executeScript((key, value) => {
        IzzyStorage.setItem(key, value);
    }, key, value);
}

async function setSubcategoryItems(
    category: string,
    items: Array<string>,
): Promise<void> {
    await setStorageValue(
        this.driver,
        `sub-${category}`,
        JSON.stringify(items)
    );
}

async function setSubcategoryItem(
    category: string,
    item: string,
): Promise<void> {
    await setStorageValue(
        this.driver,
        `sub-${category}`,
        item
    );
}

async function setSubcategoryItemsNone(category: string): Promise<void> {
    const key = `sub-${category}`;

    await setStorageValue(
        this.driver,
        key,
        (category == "housing") ? "(skipped)" : JSON.stringify([])
    );
}

async function setDemographics(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(items => {
        IzzyStorage.setItem("demographics", JSON.stringify(items));
    }, items);
}

function setDemographicsNone(): Promise<void> {
    return setDemographics.bind(this)([]);
}

async function setSubcategoriesNone(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(() => {
        IzzyStorage.setItem("sub-addiction", "[]");
        IzzyStorage.setItem("sub-counselling", "[]");
        IzzyStorage.setItem("sub-everyday-things", "[]");
        IzzyStorage.setItem("sub-health", "[]");
        IzzyStorage.setItem("sub-housing", "(skipped)");
        IzzyStorage.setItem("sub-job", "[]");
        IzzyStorage.setItem("sub-legal", "[]");
        IzzyStorage.setItem("sub-life-skills", "[]");
        IzzyStorage.setItem("sub-money", "[]");
        IzzyStorage.setItem("sub-technology", "[]");
    });
}

async function setAgeTo(option: string): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(age => {
        IzzyStorage.setItem("age", age);
    }, option);
}

async function setGender(gender: string): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(gender => {
        IzzyStorage.setItem("gender", gender);
    }, titleize(gender));
}
