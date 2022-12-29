import moment from "moment-timezone";

import ServiceOpening from "@/src/iss/ServiceOpening.js";
import type {openingHours as openingHoursType} from "@/src/iss/general.js";

/*
 * Create ServiceOpening fixture
 */
export default function getServiceOpeningFixture(
    openingHours: Array<openingHoursType>,
    currentTime: Moment,
    currentlyOpen?: boolean | null,
): Record<string, any> {
    const clonedCurrentTime = moment(currentTime);

    const nowOpen = typeof currentlyOpen === "undefined" ?
        isDuringOpenHours(clonedCurrentTime, openingHours)
        : currentlyOpen

    return new ServiceOpening(
        {
            now_open: {
                now_open: nowOpen,
                local_time: clonedCurrentTime.format(),
                notes: "",
            },
            opening_hours: openingHours,
        },
    );
}

/*
 * For an array of opening times and a given date, check if given date falls
 * within the open hours
 */
export function isDuringOpenHours(
    time: Moment,
    openingHours: Array<openingHoursType>,
): boolean {
    return openingHours.some(
        openPeriod => {
            const openingTime = convertWeekdayTimeToDate(
                openPeriod.day,
                openPeriod.open,
                time,
            )
            const closingTime = convertWeekdayTimeToDate(
                openPeriod.day,
                openPeriod.close,
                time,
            )
            return time >= openingTime && time <= closingTime
        },
    )
}

/*
 * Convert weekday, expressed as word, to a number (ie "Tuesday" = 2)
 */
export function getWeekdayNumber(weekdayName: string): number {
    return [
        "monday", "tuesday", "wednesday",
        "thursday", "friday", "saturday", "sunday",
    ].indexOf(weekdayName.toLowerCase()) + 1
}

/*
 * Convert time expressed liked "Wednesday 14:00" to a date object relative to
 * the current time.
 */
export function convertWeekdayTimeToDate(
    weekday: string,
    time: string,
    currentDateTime: Moment,
): typeof moment {
    // Get number of weekday
    const currentDay = moment(currentDateTime).day()
    const day = getWeekdayNumber(weekday)

    let date = moment(currentDateTime)
        .startOf("isoWeek") // Start of current week
        .add(day - 1, "day") // Shift date forwards to desired weekday

    // If date occurs next week (eg Wednesday this week has already passed so
    // Wednesday must refer to Wednesday next week) then shift date forward a
    // week.
    if (currentDay > day) {
        date = date.add(1, "week").add(day - 1, "day")
    }

    // Add time to date object
    date = date.add(moment.duration(time))

    return date
}



