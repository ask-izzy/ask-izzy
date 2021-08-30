/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import CollapsedOpeningTimes from "./CollapsedOpeningTimes";
import { mockedTimeDecorator, addTimesToStory } from "./OpeningTimes.stories";

export default {
    title: "Service Components/OpeningTimes/CollapsedOpeningTimes",
    component: CollapsedOpeningTimes,
    decorators: [
        mockedTimeDecorator,
    ],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <CollapsedOpeningTimes {...args} />;
};

export const CurrentlyOpen: typeof Template = Template.bind({});
addTimesToStory(CurrentlyOpen, [
    {
        day: "Wednesday",
        open: "09:00:00",
        close: "15:00:00",
    },
]);

export const BetweenTwiceInOneDay: typeof Template = Template.bind({});
addTimesToStory(BetweenTwiceInOneDay, [
    {
        day: "Wednesday",
        open: "09:00:00",
        close: "11:00:00",
    },
    {
        day: "Wednesday",
        open: "16:00:00",
        close: "18:00:00",
    },
]);

export const BeforeTwiceInOneDay: typeof Template = Template.bind({});
addTimesToStory(BeforeTwiceInOneDay, [
    {
        day: "Wednesday",
        open: "13:30:00",
        close: "14:00:00",
    },
    {
        day: "Wednesday",
        open: "16:00:00",
        close: "18:00:00",
    },
]);

export const AfterTwiceInOneDay: typeof Template = Template.bind({});
addTimesToStory(AfterTwiceInOneDay, [
    {
        day: "Wednesday",
        open: "01:00:00",
        close: "02:00:00",
    },
    {
        day: "Wednesday",
        open: "03:00:00",
        close: "04:00:00",
    },
]);

export const WithManyTimes: typeof Template = Template.bind({});
addTimesToStory(WithManyTimes, [
    {
        day: "Wednesday",
        open: "01:00:00",
        close: "02:00:00",
    },
    {
        day: "Thursday",
        open: "03:00:00",
        close: "04:00:00",
    },
    {
        day: "Friday",
        open: "03:00:00",
        close: "04:00:00",
    },
    {
        day: "Monday",
        open: "03:00:00",
        close: "04:00:00",
    },
    {
        day: "Tuesday",
        open: "03:00:00",
        close: "04:00:00",
    },
]);
