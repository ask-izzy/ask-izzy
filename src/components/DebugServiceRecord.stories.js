/* @flow */

import type {Node} from "React";
import React, {useEffect} from "react";

import DebugServiceRecord from "./DebugServiceRecord";
import fixtures from "../../fixtures/services";
import storage from "../storage";
import { addRouter } from "../storybook/decorators";

export default {
    title: "App Components/Debug/DebugServiceRecord",
    component: DebugServiceRecord,
    decorators: [
        addRouter,
        (Story: Object): Node => {
            storage.setDebug(true)
            useEffect(() => () => storage.setDebug(false))
            return <Story/>
        },
    ],
};

const Template = (args: Object): Node => {
    (Template.args: any); return <DebugServiceRecord {...args} />;
};

export const ExampleService: typeof Template = Template.bind({});
ExampleService.args = {
    object: fixtures.ixa,
};
