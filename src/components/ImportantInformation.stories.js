/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import ImportantInformation from "./ImportantInformation";
import {ixaService} from "../../fixtures/services";

export default {
    title: "App Components/ImportantInformation",
    component: ImportantInformation,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ImportantInformation {...args} />;
};

export const Example: typeof Template = Template.bind({});
ixaService.intake_point = "Bookings can be made online at " +
    "https://www.coronavirus.vic.gov.au/book-your-vaccine-appointment" +
    " or by telephone on 1800 675 398."
Example.args = {
    object: ixaService,
};
