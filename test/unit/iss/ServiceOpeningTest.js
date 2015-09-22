/* @flow */

/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */

import assert from "assert";
import moment from "moment";
import _ from "underscore";
import ServiceOpening from "../../../src/iss/ServiceOpening";

function time(now: string): Moment {
    return moment(now, "YYYY-MM-DD ha");
}

function assertEqualTime(expected: Moment, actual: Moment): void {
    assert(
        expected.isSame(actual),
        `Expected
        ${actual.format("dddd ha")} to be
        ${expected.format("dddd ha")}`
    );
}

var days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function serviceFactory(openingHours) {
    return function(open: ?boolean, now: string) {
        return new ServiceOpening(
            {
                now_open: {
                    now_open: open,
                    local_time: "",
                    notes: "",
                },
                opening_hours: openingHours.map(
                    openingHours => _.clone(openingHours)
                ),
            },
            function() {
                return time(now);
            }
        );
    };
}

describe("ServiceOpening", function() {
    describe("open 24*7 except public holidays", function() {
        var service = serviceFactory(days.map(
            function(day) {
                return {day: day, open: "00:00:00", close: "24:00:00"};
            }
        ));

        xit("never opens or closes", function() {
            var service_ = service(true, "2015-09-09 1pm");

            assert.equal(service_.open, true);
            assertEqualTime(service_.nextCloses, time("2015-09-09 5pm"));
            assertEqualTime(
                service_.nextOpeningTimes.start,
                time("2015-09-11 9am")
            );
        });

    });

    describe("open from 9am to 5pm on Wed/Fri", function() {
        var service = serviceFactory([
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
            var service_ = () => service(true, "2015-09-09 1pm");

            it("is open", function() {
                assert.equal(service_().open, true);
            });

            it("next closes at 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-09 5pm")
                );
            });

            it("next opens on friday", function() {
                assertEqualTime(
                    service_().nextOpeningTimes.start,
                    time("2015-09-11 9am")
                );
            });
        });

        describe("when it's 7am on Wednesday", function() {
            var service_ = () => service(false, "2015-09-09 7am");

            it("is closed", function() {
                assert.equal(service_().open, false);
            });

            it("next closes at 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-09 5pm")
                );
            });

            it("next opens at 9am", function() {
                assertEqualTime(
                    service_().nextOpeningTimes.start,
                    time("2015-09-09 9am")
                );
            });

        });

        describe("when it's 7pm on Wednesday", function() {
            var service_ = () => service(false, "2015-09-09 7pm");

            it("is closed", function() {
                assert.equal(service_().open, false);
            });

            it("next closes Friday 5pm", function() {
                assertEqualTime(
                    service_().nextCloses,
                    time("2015-09-11 5pm")
                );
            });

            it("next opens on Friday 9am", function() {
                assertEqualTime(
                    service_().nextOpeningTimes.start,
                    time("2015-09-11 9am")
                );
            });

        });

    });
});
