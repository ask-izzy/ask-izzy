import type {ReactNode} from "react";
import React from "react";
import GeolocationButtonForTravelTimes from "./GeolocationButtonForTravelTimes";

export default {
    title: "Basic UI Components/Geolocation Button For Travel Times",
    component: GeolocationButtonForTravelTimes,
    argTypes: {
        showMessage: {
            control: {type: "boolean"},
        },
    },
};

const Template = (args: any): ReactNode =>
    <GeolocationButtonForTravelTimes {...args} />;

export const Example: typeof Template = Template.bind({});
Example.args = {
    showMessage: false,
};
