import React, {ReactNode} from "react";

import DebugServiceRecord from "@/src/components/DebugServiceRecord";
import { ixaService } from "@/fixtures/services";
import { setDebugModeContext } from "@/src/storybook/decorators";

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