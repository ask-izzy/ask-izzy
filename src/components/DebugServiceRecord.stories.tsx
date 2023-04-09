import React, {ReactNode} from "react";

import DebugServiceRecord from "@/src/components/DebugServiceRecord.js";
import { ixaService } from "@/fixtures/services.js";
import { setDebugModeContext } from "@/src/storybook/decorators.js";


export default {
    title: "App Components/Debug/DebugServiceRecord",
    component: DebugServiceRecord,
    decorators: [setDebugModeContext]
};

const Template = (args): ReactNode => {
    return <DebugServiceRecord {...args} />;
};

export const ExampleService = Template.bind({});
ExampleService.args = {
    object: ixaService
};
ExampleService.parameters = {
    context: {
        debugMode: true
    }
};