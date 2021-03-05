/* @flow */

import React from "react";
import moment from "moment-timezone";

import OpeningTimes from "./OpeningTimes";
import ServiceOpeningFactory from "../../fixtures/factories/ServiceOpening";

export default {
    title: "Service Components/OpeningTimes",
    component: OpeningTimes,
    excludeStories: [
        "mockedTimeDecorator",
        "addTimesToStory",
    ],
    decorators: [mockedTimeDecorator],
};

const Template = (args: Object) => <OpeningTimes {...args} />;

export const CurrentlyOpen = Template.bind({});
addTimesToStory(CurrentlyOpen, [
    {
        day: "Wednesday",
        open: "10:30:00",
        close: "15:00:00",
    },
])

export const OpenForDays = Template.bind({});
addTimesToStory(OpenForDays, [
    {
        day: "Wednesday",
        open: "00:00:00",
        close: "24:00:00",
    },
    {
        day: "Thursday",
        open: "00:00:00",
        close: "24:00:00",
    },
]);

export const CurrentlyClosed = Template.bind({});
addTimesToStory(CurrentlyClosed, [
    {
        day: "Thursday",
        open: "14:30:00",
        close: "15:00:00",
    },
]);

export const ClosedForDays = Template.bind({});
addTimesToStory(ClosedForDays, [
    {
        day: "Friday",
        open: "14:30:00",
        close: "15:00:00",
    },
]);

export const OpenLaterToday = Template.bind({});
addTimesToStory(OpenLaterToday, [
    {
        day: "Wednesday",
        open: "14:30:00",
        close: "15:00:00",
    },
]);

export const OpenTomorrowMorning = Template.bind({});
addTimesToStory(OpenTomorrowMorning, [
    {
        day: "Thursday",
        open: "09:30:00",
        close: "15:00:00",
    },
]);

export const ClosedEarlierToday = Template.bind({});
addTimesToStory(ClosedEarlierToday, [
    {
        day: "Wednesday",
        open: "8:30:00",
        close: "10:00:00",
    },
]);

export const UnsureIfOpen = Template.bind({});
addTimesToStory(UnsureIfOpen, [
    {
        day: "Wednesday",
        open: "14:30:00",
        close: "15:00:00",
        note: "Every second Wednesday",
    },
], undefined, null);

export const ClosedWithNoData = Template.bind({});
addTimesToStory(ClosedWithNoData, [], undefined, false);

export const OpenWithNoData = Template.bind({});
addTimesToStory(OpenWithNoData, [], undefined, true);

export const UnsureWithNoData = Template.bind({});
addTimesToStory(UnsureWithNoData, [], undefined, null);

export const InvalidTimes = Template.bind({});
addTimesToStory(InvalidTimes, [
    {
        day: "Wednesday",
        open: "24:30:00",
        close: "25:00:00",
        note: "Every second Wednesday with invalid times",
    },
]);

export function mockedTimeDecorator(
    Story: Object,
    {parameters}: Object
) {
    const mockedCurrentTime = parameters?.context?.mockedCurrentTime
    return <>
        <Story/>
        <div
            style={{
                margin: "5em 2em 0",
                padding: "1em",
                backgroundColor: "#EEE",
            }}
        >
            (Current time mocked to{" "}
            <strong>
                {mockedCurrentTime.format("dddd hh:mm A")}
            </strong>{" "}
            {mockedCurrentTime.format("Z")}
            )
        </div>
    </>
}

export function addTimesToStory(
    Story: Object,
    times: Array<issOpeningHours>,
    currentTime: ?Moment,
    currentlyOpen: ?boolean
) {
    const mockedCurrentTime = currentTime ||
        moment("2015-09-09 1pm", "YYYY-MM-DD ha");

    Story.args = {
        object: ServiceOpeningFactory(
            times,
            mockedCurrentTime,
            currentlyOpen
        ),
    };
    Story.parameters = {
        context: {
            mockedCurrentTime,
        },
    };
}