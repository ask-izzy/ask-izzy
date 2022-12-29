import React, {ReactNode} from "react";

import ResultsList from "@/src/components/ResultsList.js";
import { ixaService, susansHouseService, domesticViolenceService } from "@/fixtures/services.js";

export default {
    title: "App Components/ResultsList",
    component: ResultsList
};

const Template = (args): ReactNode => {
    return <ResultsList {...args} />;
};

export const TwoServices = Template.bind({});
TwoServices.args = {
    results: [ixaService, susansHouseService]
};
export const IncludesCrisisLine = Template.bind({});
IncludesCrisisLine.args = {
    results: [domesticViolenceService, ixaService, susansHouseService]
};