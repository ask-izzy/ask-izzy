/* @flow */

import type {Node as ReactNode} from "React";
import React, {useEffect} from "react";

import DebugServiceRecord from "./DebugServiceRecord";
import {ixaService} from "../../fixtures/services";
import storage from "../storage";

export default {
    title: "App Components/Debug/DebugServiceRecord",
    component: DebugServiceRecord,
    decorators: [
        (Story: Object): ReactNode => {
            storage.setDebug(true)
            useEffect(() => () => storage.setDebug(false))
            return <Story/>
        },
    ],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <DebugServiceRecord {...args} />;
};

export const ExampleService: typeof Template = Template.bind({});
ExampleService.args = {
    object: ixaService,
};
