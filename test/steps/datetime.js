/* @flow */
/*
 * Step definitions for date/time related steps
 */

/* eslint-disable no-use-before-define, no-native-reassign */

import Yadda from "yadda";
import fs from "fs";
import moment from "moment";

import { documentReady } from "./browser";

import unpromisify from "../support/yadda-promise";

module.exports = (function() {
    return Yadda.localisation.English.library()
        .given("it is late on $STRING", unpromisify(changeDay));
})();

async function changeDay(day: string): Promise<void> {
    let time = moment()
        .day(day)
        .startOf("day")
        .add(18, "h")
        .valueOf();
    let offset = new Date().getTimezoneOffset();
    let script = fs.readFileSync(`${__dirname}/../support/timeshift.js`,
                                 {encoding: "utf-8"});

    await this.driver.wait(documentReady(this.driver), 10000);
    await this.driver.executeScript(script);
    await this.driver.executeScript((time, offset) => {
        Date = window.TimeShift.Date;
        window.TimeShift.setTimezoneOffset(offset);
        window.TimeShift.setTime(time);
        console.log("Mocked time to", new Date());
    }, time, offset);
}
