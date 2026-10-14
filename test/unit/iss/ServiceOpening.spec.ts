/* eslint-disable prefer-arrow-callback */

import { test } from "@playwright/test";
import assert from "assert";
import moment from "moment-timezone";
import _ from "underscore";
import ServiceOpening from "../../../src/iss/ServiceOpening";

function time(now: string): Moment {
    return moment(now, "YYYY-MM-DD ha");
}

function assertEqualTime(actual: Moment | null | undefined, expected: Moment): void {
    assert(
        expected.isSame(actual),
        `Expected
        ${actual ? actual.format("dddd ha") : actual} to be
        ${expected.format("dddd ha")}`
    );
}

function nextOpeningTimes(service: ServiceOpening): NonNullable<ServiceOpening["nextOpeningTimes"]> {
    const times = service.nextOpeningTimes;

    if (!times) {
        throw new Error("Service should have nextOpeningTimes")
    }

    return times;
}

function serviceFactory(openingHours) {
    return function(open: boolean | null | undefined, now: string) {
        return new ServiceOpening(
            {
                now_open: {
                    now_open: open,
                    local_time: time(now).format(),
                    notes: "",
                },
                opening_hours: openingHours.map(
                    openingHours => _.clone(openingHours)
                ),
            }
        );
    };
}

test.describe("ServiceOpening Opening times", function() {

    test.describe("open from 9am to 5pm on Wed/Fri", function() {
        const service = serviceFactory([
            {
                day: "Wednesday",
                open: "09:00:00",
                close: "17:00:00",
            }, {
                day: "Friday",
                open: "09:00:00",
                close: "17:00:00",
            },
        ]);

        test.describe("when it's 1pm on Wednesday", function() {
            const service_ = () => service(true, "2015-09-09 1pm");

            test("is open", function() {
                assert.equal(service_().open, true);
            });

            test("next closes at 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-09 5pm"),
                );
            });

            test("is open 'until 5pm'", function() {
                assert.equal(
                    service_().until,
                    "until 5:00 PM",
                );
            });

            test("next opens on friday", function() {
                assertEqualTime(
                    nextOpeningTimes(service_()).start,
                    time("2015-09-11 9am")
                );
            });
        });

        test.describe("when it's 7am on Wednesday", function() {
            const service_ = () => service(false, "2015-09-09 7am");

            test("is closed", function() {
                assert.equal(service_().open, false);
            });

            test("is closed 'until 9am today'", function() {
                assert.equal(
                    service_().until,
                    "until today 9:00 AM",
                );
            });

            test("next closes at 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-09 5pm")
                );
            });

            test("next opens at 9am", function() {
                assertEqualTime(
                    nextOpeningTimes(service_()).start,
                    time("2015-09-09 9am")
                );
            });

        });

        test.describe("when it's 7pm on Wednesday", function() {
            const service_ = () => service(false, "2015-09-09 7pm");

            test("is closed", function() {
                assert.equal(service_().open, false);
            });

            test("next closes Friday 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-11 5pm")
                );
            });

            test("is closed 'until 9am Friday'", function() {
                assert.equal(
                    service_().until,
                    "until Friday 9:00 AM",
                );
            });

            test("next opens on Friday 9am", function() {
                assertEqualTime(
                    nextOpeningTimes(service_()).start,
                    time("2015-09-11 9am")
                );
            });

        });

    });
});
