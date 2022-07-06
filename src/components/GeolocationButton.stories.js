/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import { action } from "@storybook/addon-actions";

import GeolocationButton from "./GeolocationButton";
import { addGoogleMapsScript } from "../storybook/decorators";

/**
 * TODO: Refactor geolocation mocking to include guessSuburb(). (I've been
 * wanting to refactor that crusty code for ages away.) Until then Google
 * Maps API must be loaded for geolocation to succeed.
 */

export default {
    title: "App Components/GeolocationButton",
    component: GeolocationButton,
    args: {
        onSuccess: (action("succeeded"): any),
    },
    decorators: [addGoogleMapsScript],
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <GeolocationButton {...args} />;
};

export const Example: typeof Template = Template.bind({});
