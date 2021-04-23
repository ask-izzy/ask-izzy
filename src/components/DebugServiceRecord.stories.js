/* @flow */

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
        (Story: Object) => {
            storage.setDebug(true)
            useEffect(() => () => storage.setDebug(false))
            return <Story/>
        },
    ],
};

const Template = (args: Object) => <DebugServiceRecord {...args} />;

export const ExampleService = Template.bind({});
ExampleService.args = {
    object: fixtures.ixa,
};
