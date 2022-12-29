import React, {ReactNode} from "react";

import MyListResults from "@/src/components/MyListResults.js";
import { ixaService, susansHouseService } from "@/fixtures/services.js";

export default {
    title: "App Components/MyListResults",
    component: MyListResults
};

const Template = (args): ReactNode => {
    return <MyListResults {...args} />;
};

export const TwoServices = Template.bind({});
TwoServices.args = {
    results: [ixaService, susansHouseService]
};