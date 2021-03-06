/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import GeolocationButton from "./GeolocationButton";
import { injectEnvVars } from "../storybook/loaders";
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
        onSuccess: action("succeeded"),
    },
    loaders: [injectEnvVars],
    decorators: [addGoogleMapsScript],
};

const Template = (args: Object) => <GeolocationButton {...args} />;

export const Example = Template.bind({});