/*
 * Step definitions for date/time related steps
 */

/* eslint-disable no-use-before-define, no-native-reassign */

import Yadda from "yadda";
import fs from "fs";
import moment from "moment-timezone";

module.exports = ((function() {
    return Yadda.localisation.English.library()
        .given("it is late morning on $STRING", changeToEarlyMorning)
        .given("it is late on $STRING", changeToLateDay);
})());

async function changeToEarlyMorning(day) {
    return changeDateAndTime.bind(this)(day, 10)
}
async function changeToLateDay(day) {
    return changeDateAndTime.bind(this)(day, 18)
}
async function changeDateAndTime(day, hour) {
    let time = moment()
        .tz("Australia/Melbourne")
        .day(day)
        .startOf("day")
        .add(hour, "h");

    await this.driver.executeScriptBeforeLoad(
        fs.readFileSync(
            `${__dirname}/../support/timeshift.js`,
            {encoding: "utf-8"}
        )
    );
    await this.driver.executeScriptBeforeLoad(`
        Date = window.TimeShift.Date; // eslint-disable-line no-global-assign
        window.TimeShift.setTime(${time.valueOf()});
        // TimeShift.js inverts offset value
        window.TimeShift.setTimezoneOffset(${time.utcOffset() * -1});
        console.log("Mocked time to:" );
        new Date().desc().split("   ")
            .map(line => line.replace(/\\s+[A-Z]+$/, ''))
            .forEach(line => console.log("    " + line.split("=").join(": ")))
    `);
}
