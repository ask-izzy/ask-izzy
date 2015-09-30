/* @flow */
/*
 * Definitions for Geolocation related steps
 */

/* eslint-disable no-use-before-define */

import Yadda from "yadda";
import { titleize } from "underscore.string";
import _ from "underscore";

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
        sessionStorage.setItem("sleep-tonight", answer);
    }, answer);
}

async function setSubcategoryItems(
    category: string,
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript((category, items) => {
        sessionStorage.setItem(`sub-${category}`, JSON.stringify(items));
    }, category, items);
}

async function setSubcategoryItemsNone(category: string): Promise<void> {
    return setSubcategoryItems.bind(this)(category, []);
}

async function setDemographics(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(items => {
        sessionStorage.setItem("demographics", JSON.stringify(items));
    }, items);
}

async function setDemographicsNone(): Promise<void> {
    return setDemographics.bind(this)([]);
}

async function setSubcategoriesNone(
    items: Array<string>,
): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(() => {
        sessionStorage.setItem("sub-addiction", "[]");
        sessionStorage.setItem("sub-counselling", "[]");
        sessionStorage.setItem("sub-everyday-things", "[]");
        sessionStorage.setItem("sub-health", "[]");
        sessionStorage.setItem("sub-housing", "[]");
        sessionStorage.setItem("sub-job", "[]");
        sessionStorage.setItem("sub-legal", "[]");
        sessionStorage.setItem("sub-life-skills", "[]");
        sessionStorage.setItem("sub-money", "[]");
        sessionStorage.setItem("sub-technology", "[]");
    });
}

async function setAgeTo(option: string): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(age => {
        sessionStorage.setItem("age", age);
    }, option);
}

async function setGender(gender: string): Promise<void> {
    await gotoUrl(this.driver, "/");  // go anywhere to start the session
    await this.driver.executeScript(gender => {
        sessionStorage.setItem("gender", gender);
    }, titleize(gender));
}
