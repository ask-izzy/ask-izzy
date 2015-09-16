/*
 * Definitions for Geolocation related steps
 */

/* @flow */

"use strict";

import Yadda from 'yadda';
import { titleize } from 'underscore.string';

import dictionary from "../support/dictionary";
import unpromisify from "../support/yadda-promise";
import { gotoUrl } from '../support/webdriver';

module.exports = (function() {
    return Yadda.localisation.English.library(dictionary)
        .given('I have (somewhere|nowhere) to sleep tonight',
               unpromisify(setSleepTonight))
        .given('I need nothing for $STRING',
               unpromisify(setSubcategoryItemsNone))
        .given('I need the following for $STRING\n$lines',
               unpromisify(setSubcategoryItems))
        .given('I am not part of any relevant demographics',
               unpromisify(setDemographicsNone))
        .given('I am part of the following demographics\n$lines',
               unpromisify(setDemographics))
        .given('my gender is $STRING', unpromisify(setGender))
        .given('I am 27 years old', unpromisify(setAgeToMiddle))
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

    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript(answer => {
        sessionStorage.setItem("sleep-tonight", answer);
    }, answer);
}

async function setSubcategoryItems(category: string, items: Array<string>):
    Promise<void>
{
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript((category, items) => {
        sessionStorage.setItem(`sub-${category}`, JSON.stringify(items));
    }, category, items);
}

async function setSubcategoryItemsNone(category: string): Promise<void> {
    return setSubcategoryItems.bind(this)(category, []);
}

async function setDemographics(items: Array<string>):
    Promise<void>
{
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript(items => {
        sessionStorage.setItem('demographics', JSON.stringify(items));
    }, items);
}

async function setDemographicsNone(): Promise<void> {
    return setDemographics.bind(this)([]);
}

async function setAgeToMiddle(): Promise<void> {
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript(age => {
        sessionStorage.setItem('age', age);
    }, "27 to 54");
}

async function setGender(gender: string): Promise<void> {
    await gotoUrl(this.driver, '/');  // go anywhere to start the session
    await this.driver.executeScript(gender => {
        sessionStorage.setItem('gender', gender);
    }, titleize(gender));
}
