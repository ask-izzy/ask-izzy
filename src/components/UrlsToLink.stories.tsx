import React, {ReactNode} from "react";

import UrlsToLink from "@/src/components/UrlsToLink.js";


export default {
    title: "App Components/UrlsToLink",
    component: UrlsToLink
};
const exampleString = "Bookings can be made online at " +
    "https://www.coronavirus.vic.gov.au/book-your-vaccine-appointment" +
    " or by telephone on 1800 675 398.";

const Template = (args): ReactNode => {
    return <UrlsToLink {...args}>{exampleString}</UrlsToLink>;
};

export const Example: typeof Template = Template.bind({});