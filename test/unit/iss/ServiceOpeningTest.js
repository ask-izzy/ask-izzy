/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";
import moment from "moment-timezone";
import _ from "underscore";

import ServiceOpening from "../../../src/iss/ServiceOpening";

function time(now) {
    return moment(now, "YYYY-MM-DD ha");
}

function assertEqualTime(actual, expected) {
    assert(
        expected.isSame(actual),
        `Expected
        ${actual ? actual.format("dddd ha") : actual} to be
        ${expected.format("dddd ha")}`
    );
}

function nextOpeningTimes(service) {
    const times = service.nextOpeningTimes;

    if (!times) {
        throw new Error("Service should have nextOpeningTimes")
    }

    return times;
}

function serviceFactory(openingHours) {
    return function(open, now) {
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

describe("ServiceOpening Opening times", function() {

    describe("open from 9am to 5pm on Wed/Fri", function() {
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

        describe("when it's 1pm on Wednesday", function() {
            const service_ = () => service(true, "2015-09-09 1pm");

            it("is open", function() {
                assert.equal(service_().open, true);
            });

            it("next closes at 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-09 5pm"),
                );
            });

            it("is open 'until 5pm'", function() {
                assert.equal(
                    service_().until,
                    "until 5:00 PM",
                );
            });

            it("next opens on friday", function() {
                assertEqualTime(
                    nextOpeningTimes(service_()).start,
                    time("2015-09-11 9am")
                );
            });
        });

        describe("when it's 7am on Wednesday", function() {
            const service_ = () => service(false, "2015-09-09 7am");

            it("is closed", function() {
                assert.equal(service_().open, false);
            });

            it("is closed 'until 9am today'", function() {
                assert.equal(
                    service_().until,
                    "until today 9:00 AM",
                );
            });

            it("next closes at 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-09 5pm")
                );
            });

            it("next opens at 9am", function() {
                assertEqualTime(
                    nextOpeningTimes(service_()).start,
                    time("2015-09-09 9am")
                );
            });

        });

        describe("when it's 7pm on Wednesday", function() {
            const service_ = () => service(false, "2015-09-09 7pm");

            it("is closed", function() {
                assert.equal(service_().open, false);
            });

            it("next closes Friday 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-11 5pm")
                );
            });

            it("is closed 'until 9am Friday'", function() {
                assert.equal(
                    service_().until,
                    "until Friday 9:00 AM",
                );
            });

            it("next opens on Friday 9am", function() {
                assertEqualTime(
                    nextOpeningTimes(service_()).start,
                    time("2015-09-11 9am")
                );
            });

        });

    });
});
