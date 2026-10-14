import type {ReactNode} from "react";
import React from "react";

import DebugServiceRecord from "./DebugServiceRecord";
import {ixaService} from "../../fixtures/services";
import { setDebugModeContext } from "../storybook/decorators";

export default {
    title: "App Components/Debug/DebugServiceRecord",
    component: DebugServiceRecord,
    decorators: [setDebugModeContext],
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <DebugServiceRecord {...args} />;
};

export const ExampleService: typeof Template = Template.bind({});
ExampleService.args = {
    object: ixaService,
};
ExampleService.parameters = {
    context: {
        debugMode: true,
    },
};
