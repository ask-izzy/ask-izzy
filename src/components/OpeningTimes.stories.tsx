import React, {ReactNode} from "react";
import moment from "moment-timezone";

import OpeningTimes from "@/src/components/OpeningTimes";
import getServiceOpeningFixture from "@/fixtures/factories/ServiceOpening";
import type { openingHours } from "@/src/iss/general";
export default {
    title: "Service Components/OpeningTimes",
    component: OpeningTimes,
    excludeStories: ["mockedTimeDecorator", "addTimesToStory"],
    decorators: [mockedTimeDecorator]
};

const Template = (args): ReactNode => {
    return <OpeningTimes {...args} />;
};

export const CurrentlyOpen: typeof Template = Template.bind({});
addTimesToStory(CurrentlyOpen, [{
    day: "Wednesday",
    open: "10:30:00",
    close: "15:00:00"
}]);
export const CurrentlyOpenCompact: typeof Template = Template.bind({});
addTimesToStory(CurrentlyOpenCompact, [{
    day: "Wednesday",
    open: "10:30:00",
    close: "15:00:00"
}], true);
export const OpenForDays: typeof Template = Template.bind({});
addTimesToStory(OpenForDays, [{
    day: "Wednesday",
    open: "00:00:00",
    close: "24:00:00"
}, {
    day: "Thursday",
    open: "00:00:00",
    close: "24:00:00"
}]);
export const CurrentlyClosed: typeof Template = Template.bind({});
addTimesToStory(CurrentlyClosed, [{
    day: "Thursday",
    open: "14:30:00",
    close: "15:00:00"
}]);
export const ClosedForDays: typeof Template = Template.bind({});
addTimesToStory(ClosedForDays, [{
    day: "Friday",
    open: "14:30:00",
    close: "15:00:00"
}]);
export const OpenLaterToday: typeof Template = Template.bind({});
addTimesToStory(OpenLaterToday, [{
    day: "Wednesday",
    open: "14:30:00",
    close: "15:00:00"
}]);
export const OpenTomorrowMorning: typeof Template = Template.bind({});
addTimesToStory(OpenTomorrowMorning, [{
    day: "Thursday",
    open: "09:30:00",
    close: "15:00:00"
}]);
export const ClosedEarlierToday: typeof Template = Template.bind({});
addTimesToStory(ClosedEarlierToday, [{
    day: "Wednesday",
    open: "8:30:00",
    close: "10:00:00"
}]);
export const UnsureIfOpen: typeof Template = Template.bind({});
addTimesToStory(UnsureIfOpen, [{
    day: "Wednesday",
    open: "14:30:00",
    close: "15:00:00",
    note: "Every second Wednesday"
}], undefined, undefined, null);
export const ClosedWithNoData: typeof Template = Template.bind({});
addTimesToStory(ClosedWithNoData, [], undefined, undefined, false);
export const OpenWithNoData: typeof Template = Template.bind({});
addTimesToStory(OpenWithNoData, [], undefined, undefined, true);
export const UnsureWithNoData: typeof Template = Template.bind({});
addTimesToStory(UnsureWithNoData, [], undefined, undefined, null);
export const InvalidTimes: typeof Template = Template.bind({});
addTimesToStory(InvalidTimes, [{
    day: "Wednesday",
    open: "24:30:00",
    close: "25:00:00",
    note: "Every second Wednesday with invalid times"
}]);
export function mockedTimeDecorator(Story, {
    parameters
}: Record<string, any>): ReactNode {
    const mockedCurrentTime = parameters?.context?.mockedCurrentTime;
    return <>
        <Story />
        <div
            style={{
                margin: "5em 2em 0",
                padding: "1em",
                backgroundColor: "#EEE"
            }}
        >
            (Current time mocked to{" "}
            <strong>
                {mockedCurrentTime.format("dddd hh:mm A")}
            </strong>{" "}
            {mockedCurrentTime.format("Z")}
            )
        </div>
    </>;
}
export function addTimesToStory(
    Story: Record<string, any>,
    times: Array<openingHours>,
    compact?: boolean | null | undefined,
    currentTime?: Moment | null,
    currentlyOpen?: boolean | null
) {
    const mockedCurrentTime = currentTime || moment("2015-09-09 1pm", "YYYY-MM-DD ha");
    Story.args = {
        object: getServiceOpeningFixture(times, mockedCurrentTime, currentlyOpen),
        ...(typeof compact !== "undefined" ? {
            compact
        } : {})
    };
    Story.parameters = {
        context: {
            mockedCurrentTime
        }
    };
}