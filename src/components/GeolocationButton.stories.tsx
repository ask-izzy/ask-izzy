import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import GeolocationButton from "@/src/components/GeolocationButton.js";
import {addGoogleMapsScript} from "@/src/storybook/decorators.js";
/**
 * TODO: Refactor geolocation mocking to include guessSuburb(). (I've been
 * wanting to refactor that crusty code for ages away.) Until then Google
 * Maps API must be loaded for geolocation to succeed.
 */

export default {
    title: "App Components/GeolocationButton",
    component: GeolocationButton,
    args: {
        onSuccess: (action("succeeded") as any)
    },
    decorators: [addGoogleMapsScript]
};

const Template = (args): ReactNode => {
    return <GeolocationButton {...args} />;
};

export const Example: typeof Template = Template.bind({});