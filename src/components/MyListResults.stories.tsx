import React, {ReactNode} from "react";

import MyListResults from "@/src/components/MyListResults";
import { ixaService, susansHouseService } from "@/fixtures/services";

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