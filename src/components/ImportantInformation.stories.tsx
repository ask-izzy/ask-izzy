import React, {ReactNode} from "react";

import ImportantInformation from "@/src/components/ImportantInformation";
import { ixaService } from "@/fixtures/services";

export default {
    title: "App Components/ImportantInformation",
    component: ImportantInformation
};

const Template = (args): ReactNode => {
    return <ImportantInformation {...args} />;
};

export const Example = Template.bind({});
ixaService.intake_point = "Bookings can be made online at " +
    "https://www.coronavirus.vic.gov.au/book-your-vaccine-appointment" +
    " or by telephone on 1800 675 398.";
Example.args = {
    object: ixaService
};