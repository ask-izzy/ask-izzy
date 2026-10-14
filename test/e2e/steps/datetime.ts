/*
 * Step definitions for date/time related steps
 */

import fs from "fs"
import path from "path"
import Yadda from "yadda"
import moment from "moment-timezone"

import type { StepContext } from "../support/world"

export default Yadda.localisation.English.library()
    .given("it is late morning on $STRING", async function(this: StepContext, day: string) {
        await changeDateAndTime(this, day, 10)
    })
    .given("it is late on $STRING", async function(this: StepContext, day: string) {
        await changeDateAndTime(this, day, 18)
    })

async function changeDateAndTime(
    stepContext: StepContext,
    day: string,
    hour: number
): Promise<void> {
    const time = moment()
        .tz("Australia/Melbourne")
        .day(day)
        .startOf("day")
        .add(hour, "h")

    const timeshiftSource = fs.readFileSync(
        path.join(__dirname, "../support/timeshift.js"),
        {encoding: "utf-8"}
    )

    await stepContext.world.page.addInitScript(timeshiftSource)
    await stepContext.world.page.addInitScript(`
        Date = window.TimeShift.Date; // eslint-disable-line no-global-assign
        window.TimeShift.setTime(${time.valueOf()});
        // TimeShift.js inverts offset value
        window.TimeShift.setTimezoneOffset(${time.utcOffset() * -1});
        console.log("Mocked time to:" );
        new Date().desc().split("   ")
            .map(line => line.replace(/\\s+[A-Z]+$/, ''))
            .forEach(line => console.log("    " + line.split("=").join(": ")))
    `)
}
