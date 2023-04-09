import React, {ReactNode} from "react";

import DebugQueryScore from "@/src/components/DebugQueryScore.js";
import searchExplanationFixtures from "@/fixtures/searchExplanations.js";


export default {
    title: "App Components/Debug/DebugQueryScore",
    component: DebugQueryScore
};

const Template = (args): ReactNode => {
    return <DebugQueryScore {...args} />;
};

export const Example = Template.bind({});
Example.args = {
    expl: searchExplanationFixtures.housing
};