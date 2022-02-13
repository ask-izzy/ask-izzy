/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import UrlsToLink from "./UrlsToLink";

export default {
    title: "App Components/UrlsToLink",
    component: UrlsToLink,
};
const exampleString = "Bookings can be made online at " +
    "https://www.coronavirus.vic.gov.au/book-your-vaccine-appointment" +
    " or by telephone on 1800 675 398."
const Template = (args: Object): ReactNode => {
    (Template.args: any);
    return <UrlsToLink {...args}>{exampleString}</UrlsToLink>;
};

export const Example: typeof Template = Template.bind({});

