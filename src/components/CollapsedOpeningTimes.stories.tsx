import React, {ReactNode} from "react";

import CollapsedOpeningTimes from "@/src/components/CollapsedOpeningTimes.js";
import { mockedTimeDecorator, addTimesToStory } from "@/src/components/OpeningTimes.stories";

export default {
    title: "Service Components/OpeningTimes/CollapsedOpeningTimes",
    component: CollapsedOpeningTimes,
    decorators: [mockedTimeDecorator]
};

const Template = (args): ReactNode => {
    return <CollapsedOpeningTimes {...args} />;
};

export const CurrentlyOpen = Template.bind({});
addTimesToStory(CurrentlyOpen, [{
    day: "Wednesday",
    open: "09:00:00",
    close: "15:00:00"
}]);
export const BetweenTwiceInOneDay = Template.bind({});
addTimesToStory(BetweenTwiceInOneDay, [{
    day: "Wednesday",
    open: "09:00:00",
    close: "11:00:00"
}, {
    day: "Wednesday",
    open: "16:00:00",
    close: "18:00:00"
}]);
export const BeforeTwiceInOneDay = Template.bind({});
addTimesToStory(BeforeTwiceInOneDay, [{
    day: "Wednesday",
    open: "13:30:00",
    close: "14:00:00"
}, {
    day: "Wednesday",
    open: "16:00:00",
    close: "18:00:00"
}]);
export const AfterTwiceInOneDay = Template.bind({});
addTimesToStory(AfterTwiceInOneDay, [{
    day: "Wednesday",
    open: "01:00:00",
    close: "02:00:00"
}, {
    day: "Wednesday",
    open: "03:00:00",
    close: "04:00:00"
}]);
export const WithManyTimes = Template.bind({});
addTimesToStory(WithManyTimes, [{
    day: "Wednesday",
    open: "01:00:00",
    close: "02:00:00"
}, {
    day: "Thursday",
    open: "03:00:00",
    close: "04:00:00"
}, {
    day: "Friday",
    open: "03:00:00",
    close: "04:00:00"
}, {
    day: "Monday",
    open: "03:00:00",
    close: "04:00:00"
}, {
    day: "Tuesday",
    open: "03:00:00",
    close: "04:00:00"
}]);